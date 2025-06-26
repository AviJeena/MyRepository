function runGlobalCode() {
  const code = document.getElementById("global-code-editor").value;

  let simulatedOutput = "";
  try {
    if (code.includes("print(")) {
      simulatedOutput = code
        .split("\n")
        .filter(line => line.includes("print("))
        .map(line => line.match(/print\((.*)\)/)?.[1]?.replace(/['"]+/g, '') || "")
        .join("\n");
    } else {
      simulatedOutput = "// No output (try using print)";
    }
  } catch (e) {
    simulatedOutput = "⚠️ Error: " + e.message;
  }

  document.getElementById("global-output-area").textContent = simulatedOutput;
}
