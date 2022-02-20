# Profile Image Resize - 2022

# Import Librarys
import os

from flask import Flask, session, request, flash, jsonify, redirect, render_template
from flask_cors import CORS, cross_origin
from datetime import datetime, timedelta
from flask_sitemap import Sitemap



# Global Variables
UPLOAD_FOLDER = '/static/uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

# Configure application
app = Flask(__name__)
CORS(app, support_credentials=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Sitemap
ext = Sitemap(app=app)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"

    response.headers["Access-Control-Expose-Headers"] = "Content-Disposition, Content-Length, X-Content-Transfer-Id"
    #response.headers["Content-Type"] = "image/jpeg"
    #response.headers["Content-Length"] = "3965123"
    #response.headers["Content-Disposition"] = "inline; filename='my-file.jpg'"
    #response.headers["X-Content-Transfer-Id"] = "12345"

    return response


# Index Page
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        # POST method
        print("post method called")
        return redirect("/")
    else:
        # GET method
        return render_template('index.html')

# Upload?
@app.route("/static/uploads", methods=["POST"])
@cross_origin(supports_credentials=True)
def upload():
    print()
    return redirect("/")

@app.route('/uploader', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        f = request.files['file']
        f.save("static/uploads/" + f.filename)
        return 'file uploaded successfully'


# Contact Page
@app.route("/contact")
def contact_page():
    return render_template('contact.html')

# Terms Page
@app.route("/terms")
def terms_page():
    return render_template('terms.html')

# File save?
@app.route("/filesave", methods=['POST'])
def list_files():
    f = request.files['file']
    f.save("static/uploads/" + f.filename)
    return jsonify(files)


# Sitemap extension
@ext.register_generator
def index():
    yield 'index', {}


# Debugger mode
if __name__ == '__main__':
    app.run(debug=True)
