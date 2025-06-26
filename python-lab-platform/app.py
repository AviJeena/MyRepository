from flask import Flask, render_template, request, jsonify
import subprocess

app = Flask(__name__)

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/concept/<topic>')
def concept(topic):
    return render_template("concept.html", topic=topic)

@app.route('/practice')
def practice():
    return render_template('practice.html')

@app.route('/run', methods=['POST'])
def run_code():
    data = request.get_json()
    code = data.get('code')

    try:
        result = subprocess.run(
            ['python3', '-c', code],
            capture_output=True,
            text=True,
            timeout=5
        )
        return jsonify({ 'output': result.stdout if result.stdout else result.stderr })
    except Exception as e:
        return jsonify({ 'output': str(e) })


if __name__ == '__main__':
    app.run(debug=True)

