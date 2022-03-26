# Profile Image Resize - 2022

# Import Librarys
#import os
import os
from flask import Flask, send_from_directory, session, request, flash, jsonify, redirect, render_template
from flask_cors import CORS, cross_origin
# from datetime import datetime, timedelta
from flask_sitemap import Sitemap


# Configure application
app = Flask(__name__)
CORS(app, support_credentials=True)

# Sitemap
ext = Sitemap(app=app)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True


@app.after_request
def after_request(response):
    """ Cache 200 """
    #response.headers["Cache-Control"] = "max-age=200"

    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"

    #response.headers["Access-Control-Expose-Headers"] = "Content-Disposition, Content-Length, X-Content-Transfer-Id"
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
        print("Post method called")
        return redirect("/")
    else:
        # GET method
        title = ""
        return render_template('index.html', title=title)


# Contact Page
@app.route("/contact")
def contact_page():
    title = "Contact - "
    return render_template('contact.html', title=title)


# Terms Page
@app.route("/terms")
def terms_page():
    title = "Terms - "
    return render_template('terms.html', title=title)


# Sitemap extension
# ####### TODO --> To be removed?
@ext.register_generator
def index_sitemap():
    yield 'index', {}


# Favicon
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),'favicon.ico',mimetype='image/vnd.microsoft.icon')

@app.route('/apple-touch-icon.png')
def AppleTouchIcon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                          'apple-touch-icon.png',mimetype='image/png')

@app.route('/browserconfig.xml')
def browserconfigXml():
  return send_from_directory(os.path.join(app.root_path, 'static'),'browserconfig.xml', mimetype='image/png')

#app.add_url_rule('/apple-touch-icon.png', redirect_to=url_for('static', filename='apple-touch-icon.png'))
#app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon.ico'))
#app.add_url_rule('/browserconfig.xml', redirect_to=url_for('static', filename='browserconfig.xml'))


# Debugger mode
if __name__ == '__main__':
    app.run(debug=True)
