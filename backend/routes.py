from flask import request, jsonify
from models import db, User, Project, Task
from datetime import datetime

def init_routes(app):

    # --- AUTHENTICATION HELPERS ---
    def get_current_user():
        user_id = request.headers.get('User-ID')
        return User.query.get(user_id)

    # --- PROJECT ROUTES ---
    @app.route('/projects', methods=['GET', 'POST'])
    def handle_projects():
        user = get_current_user()
        if not user:
            return jsonify({"error": "Unauthorized"}), 401

        if request.method == 'POST':
            if user.role != 'Admin':
                return jsonify({"error": "Only Admins can create projects"}), 403
            
            data = request.json
            new_project = Project(name=data['name'])
            db.session.add(new_project)
            db.session.commit()
            return jsonify({"message": "Project created", "id": new_project.id}), 201

        projects = Project.query.all()
        return jsonify([{"id": p.id, "name": p.name} for p in projects])

    # --- TASK ROUTES ---
    @app.route('/tasks', methods=['GET', 'POST'])
    def handle_tasks():
        user = get_current_user()
        if not user: return jsonify({"error": "Unauthorized"}), 401

        if request.method == 'POST':
            if user.role != 'Admin':
                return jsonify({"error": "Only Admins can assign tasks"}), 403
            
            data = request.json
            task = Task(
                title=data['title'],
                project_id=data['project_id'],
                assigned_to=data['assigned_to'], # User ID
                due_date=datetime.fromisoformat(data['due_date']) if data.get('due_date') else None
            )
            db.session.add(task)
            db.session.commit()
            return jsonify({"message": "Task assigned"}), 201

        # Members see only their tasks; Admins see everything
        if user.role == 'Admin':
            tasks = Task.query.all()
        else:
            tasks = Task.query.filter_by(assigned_to=user.id).all()
            
        return jsonify([{
            "id": t.id, 
            "title": t.title, 
            "status": t.status, 
            "project": t.project.name
        } for t in tasks])

    @app.route('/tasks/<int:task_id>', methods=['PATCH'])
    def update_task_status(task_id):
        user = get_current_user()
        task = Task.query.get_or_404(task_id)

        # Ensure the user is either the assignee or an Admin
        if user.role != 'Admin' and task.assigned_to != user.id:
            return jsonify({"error": "Access denied"}), 403

        data = request.json
        if 'status' in data:
            task.status = data['status']
            db.session.commit()
        
        return jsonify({"message": "Status updated"})