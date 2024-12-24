from flask import Flask, render_template, request, jsonify
import random
import string

app = Flask(__name__)

def generate_password(length=12, include_uppercase=True, include_digits=True, include_special=True):
    char_pool = string.ascii_lowercase
    if include_uppercase:
        char_pool += string.ascii_uppercase
    if include_digits:
        char_pool += string.digits
    if include_special:
        char_pool += string.punctuation
    
    password = ''.join(random.choice(char_pool) for _ in range(length))
    return password

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    length = int(request.form.get('length', 12))
    include_uppercase = request.form.get('uppercase') == 'on'
    include_digits = request.form.get('digits') == 'on'
    include_special = request.form.get('special') == 'on'
    password = generate_password(length, include_uppercase, include_digits, include_special)
    return jsonify({'password': password})

if __name__ == '__main__':
    app.run(debug=True)
