let astSteps = [];
let currentStep = 0;

function tokenize(expression) {
  const regex = /\s*([A-Za-z]+|\d+|[+\-*/();])\s*/g;
  const tokens = [];
  let match;
  while ((match = regex.exec(expression)) !== null) {
    const value = match[1];
    let type = 'Unknown';
    if (/^\d+$/.test(value)) type = 'Number';
    else if (/^[A-Za-z]+$/.test(value)) type = 'Identifier';
    else if (/^[+\-*/]$/.test(value)) type = 'Operator';
    else if (/^[();]$/.test(value)) type = 'Punctuation';
    tokens.push({ type, value });
  }
  return tokens;
}

function parseVariables(variableStr) {
  const vars = {};
  const pairs = variableStr.split(',');
  for (let pair of pairs) {
    const [key, val] = pair.split('=').map(s => s.trim());
    if (key && !isNaN(Number(val))) {
      vars[key] = Number(val);
    }
  }
  return vars;
}

function parse(tokens) {
  let i = 0;

  function parsePrimary() {
    const token = tokens[i++];
    if (!token) throw new Error('Unexpected end of input');
    if (token.value === '(') {
      const node = parseExpression();
      if (tokens[i++].value !== ')') throw new Error("Expected ')'");
      return node;
    } else if (token.type === 'Identifier' || token.type === 'Number') {
      return { type: 'Literal', value: token.value };
    }
    throw new Error(`Unexpected token: ${token.value}`);
  }

  function parseMultiplicative() {
    let node = parsePrimary();
    while (tokens[i] && (tokens[i].value === '*' || tokens[i].value === '/')) {
      const operator = tokens[i++].value;
      const right = parsePrimary();
      node = { type: 'Binary', operator, left: node, right };
    }
    return node;
  }

  function parseExpression() {
    let node = parseMultiplicative();
    while (tokens[i] && (tokens[i].value === '+' || tokens[i].value === '-')) {
      const operator = tokens[i++].value;
      const right = parseMultiplicative();
      node = { type: 'Binary', operator, left: node, right };
    }
    return node;
  }

  const ast = parseExpression();
  if (i < tokens.length) throw new Error(`Unexpected token: ${tokens[i].value}`);
  return ast;
}

function evaluate(ast, variables) {
  if (ast.type === 'Literal') {
    const val = ast.value;
    if (/^[A-Za-z]+$/.test(val)) {
      if (val in variables) return variables[val];
      throw new Error(`Undefined variable: ${val}`);
    }
    return Number(val);
  }
  const left = evaluate(ast.left, variables);
  const right = evaluate(ast.right, variables);
  switch (ast.operator) {
    case '+': return left + right;
    case '-': return left - right;
    case '*': return left * right;
    case '/':
      if (right === 0) throw new Error('Division by zero');
      return left / right;
    default:
      throw new Error(`Unknown operator: ${ast.operator}`);
  }
}

function displayAST(ast, depth = 0) {
  if (!ast) return null;

  const node = document.createElement('div');
  node.className = 'ast-node';

  const label = document.createElement('div');
  label.className = 'ast-label';

  if (ast.type === 'Literal') {
    label.textContent = `Literal(${ast.value})`;
    label.title = `Type: Literal\nValue: ${ast.value}\nDepth: ${depth}`;
    node.appendChild(label);
  } else if (ast.type === 'Binary') {
    label.textContent = `Binary(${ast.operator})`;
    label.title = `Type: Binary Expression\nOperator: ${ast.operator}\nDepth: ${depth}`;
    node.appendChild(label);

    const children = document.createElement('div');
    const left = displayAST(ast.left, depth + 1);
    const right = displayAST(ast.right, depth + 1);
    if (left) children.appendChild(left);
    if (right) children.appendChild(right);

    node.appendChild(children);
  }

  return node;
}

function analyzeExpression() {
  const expr = document.getElementById('expressionInput').value;
  const vars = parseVariables(document.getElementById('variablesInput').value);

  const tokenContainer = document.getElementById('tokens');
  const resultContainer = document.getElementById('result');
  const errorContainer = document.getElementById('error');
  const astContainer = document.getElementById('ast');

  tokenContainer.innerHTML = '';
  resultContainer.innerText = '';
  errorContainer.innerText = '';
  astContainer.innerText = '';

  try {
    const tokens = tokenize(expr);
    tokens.forEach(tok => {
  const div = document.createElement('div');
  div.textContent = `${tok.type}: '${tok.value}'`;

  switch (tok.type) {
    case 'Identifier':
      div.className = 'token-identifier';
      break;
    case 'Number':
      div.className = 'token-number';
      break;
    case 'Operator':
      div.className = 'token-operator';
      break;
    case 'Punctuation':
      div.className = 'token-punctuation';
      break;
    default:
      div.className = 'token-unknown';
  }

  tokenContainer.appendChild(div);
});


    const ast = parse(tokens);
    const result = evaluate(ast, vars);
    resultContainer.innerText = result;
    astContainer.innerText = JSON.stringify(ast, null, 2);

  } catch (e) {
    errorContainer.innerText = e.message;
  }
}

function collectASTSteps(ast) {
  const steps = [];
  function walk(node) {
    if (!node) return;
    steps.push(structuredClone(node));
    if (node.left) walk(node.left);
    if (node.right) walk(node.right);
  }
  walk(ast);
  return steps;
}

function startVisualization() {
  const expr = document.getElementById('expressionInput').value;
  const vars = parseVariables(document.getElementById('variablesInput').value);

  const stepTreeContainer = document.getElementById('stepTree');
  const visualizationArea = document.getElementById('visualizationArea');
  stepTreeContainer.innerHTML = '';
  currentStep = 0;

  try {
    const tokens = tokenize(expr);
    const ast = parse(tokens);
    astSteps = collectASTSteps(ast);

    visualizationArea.style.display = 'block';
    nextStep();
  } catch (e) {
    stepTreeContainer.innerText = `Error: ${e.message}`;
  }
}

function nextStep() {
  const stepTreeContainer = document.getElementById('stepTree');
  if (currentStep >= astSteps.length) {
    stepTreeContainer.innerHTML += "<p>🎉 AST Fully Built!</p>";
    return;
  }

  const node = displayAST(astSteps[currentStep]);
  if (node) stepTreeContainer.appendChild(node);
  currentStep++;
}


function startVisualization() {
  const expr = document.getElementById('expressionInput').value;
  const tokens = tokenize(expr);
  const ast = parse(tokens);

  document.getElementById('visualizationArea').style.display = 'block';
  document.getElementById('treeSvg').innerHTML = ''; // clear previous
  astSteps = [];
  currentStep = 0;

  prepareTreeSteps(ast, 400, 40, 200); // start from center top
}

function nextStep() {
  if (currentStep >= astSteps.length) return;
  const step = astSteps[currentStep++];
  const svg = document.getElementById('treeSvg');

  if (step.type === 'node') {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute('cx', step.x);
    circle.setAttribute('cy', step.y);
    circle.setAttribute('r', 20);
    circle.setAttribute('class', 'tree-node');
    svg.appendChild(circle);
    setTimeout(() => circle.style.opacity = 1, 50);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute('x', step.x);
    text.setAttribute('y', step.y);
    text.setAttribute('class', 'tree-label');
    text.textContent = step.label;
    svg.appendChild(text);
    setTimeout(() => text.style.opacity = 1, 100);

  } else if (step.type === 'line') {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute('x1', step.x1);
    line.setAttribute('y1', step.y1);
    line.setAttribute('x2', step.x2);
    line.setAttribute('y2', step.y2);
    line.setAttribute('class', 'tree-line');
    svg.appendChild(line);
    setTimeout(() => line.style.opacity = 1, 50);
  }
}
let playInterval = null;
let isPlaying = false;

function togglePlay() {
  const btn = document.getElementById('playBtn');

  if (!isPlaying) {
    btn.textContent = "Pause";
    playInterval = setInterval(() => {
      if (currentStep >= astSteps.length) {
        clearInterval(playInterval);
        isPlaying = false;
        btn.textContent = "Play Full Visualization";
        return;
      }
      nextStep();
    }, 800); // speed: 800ms per step
    isPlaying = true;
  } else {
    clearInterval(playInterval);
    isPlaying = false;
    btn.textContent = "Play Full Visualization";
  }
}

// Recursive traversal to generate steps
function prepareTreeSteps(node, x, y, spacing) {
  if (!node) return;

  astSteps.push({ type: 'node', x, y, label: node.type === 'Binary' ? node.operator : node.value });

  if (node.left) {
    const leftX = x - spacing;
    const leftY = y + 100;
    astSteps.push({ type: 'line', x1: x, y1: y + 20, x2: leftX, y2: leftY - 20 });
    prepareTreeSteps(node.left, leftX, leftY, spacing / 1.5);
  }

  if (node.right) {
    const rightX = x + spacing;
    const rightY = y + 100;
    astSteps.push({ type: 'line', x1: x, y1: y + 20, x2: rightX, y2: rightY - 20 });
    prepareTreeSteps(node.right, rightX, rightY, spacing / 1.5);
  }
}


