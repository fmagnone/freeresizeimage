# Resize Image App - 2022

# Import Librarys
#import os
import os
from flask import Flask, send_from_directory, session, request, flash, jsonify, redirect, render_template
from flask_cors import CORS, cross_origin
#from datetime import datetime, timedelta
#from flask_sitemap import Sitemap
#from werkzeug.middleware.proxy_fix import ProxyFix
#from flask_talisman import Talisman
#from flask_sslify import SSLify



# Configure application
app = Flask(__name__)

# Wrap Flask app with Talisman
#Talisman(app)

#sslify = SSLify(app)
#app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1)
CORS(app, support_credentials=True)


# Sitemap
# ext = Sitemap(app=app)

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
        title = "Free Image Resizer to resize images and photos online"
        return render_template('index.html', title=title)


# Contact Page
@app.route("/contact")
def contact_page():
    title = "Contact Us - Free Image Resizer"
    return render_template('contact.html', title=title)

# Terms Page
@app.route("/terms")
def terms_page():
    title = "Terms - Free Image Resizer"
    return render_template('terms.html', title=title)

# Other pages
@app.route("/resize-image-to-1080x1080")
def resizeimageto1080x1080_page():
    title = "Resize image to 1080x1080 - Free Image Resizer"
    return render_template('resize-image-to-1080x1080.html', title=title)

@app.route("/resize-images-for-open-graph-social-media")
def resizeimagesforopengraphsocialmedia_page():
    title = "Resize images for Open Graph and Social Media - Free Image Resizer"
    return render_template('resize-images-for-open-graph-social-media.html', title=title)

@app.route("/how-to-reduce-jpg-size-online")
def hotworeducejpgsizeonline_page():
    title = "How to reduce JPG size online - Free Image Resizer"
    return render_template('how-to-reduce-jpg-size-online.html', title=title)

# Sitemap extension
# @ext.register_generator
# def index_sitemap():
#    yield 'index', {}

@app.route('/sitemap.xml')
def sitemap_xml():
    return send_from_directory(os.path.join(app.root_path, 'static'),'sitemap.xml',mimetype='application/xml')

@app.route('/robots.txt')
def robots_txt():
    return send_from_directory(os.path.join(app.root_path, 'static'),'robots.txt',mimetype='text/plain')


# Favicon
@app.route('/favicon.ico')
def favicon_ico():
    return send_from_directory(os.path.join(app.root_path, 'static'),'favicon.ico',mimetype='image/vnd.microsoft.icon')

@app.route('/favicon.png')
def favicon_png():
    return send_from_directory(os.path.join(app.root_path, 'static'),'favicon.png',mimetype='image/png')

@app.route('/apple-touch-icon.png')
def AppleTouchIcon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                          'apple-touch-icon.png',mimetype='image/png')

@app.route('/browserconfig.xml')
def browserconfigXml():
  return send_from_directory(os.path.join(app.root_path, 'static'),'browserconfig.xml', mimetype='image/png')




# Debugger mode
if __name__ == '__main__':
    app.run(debug=False)
