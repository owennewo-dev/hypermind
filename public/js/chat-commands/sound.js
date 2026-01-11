export const soundCommand = {
  description: "Toggles sound effects",
  execute: () => {
    if (window.SoundManager) {
      const enabled = window.SoundManager.toggle();
      const status = enabled ? "enabled" : "disabled";
      const output = document.getElementById("terminal-output");
      if (output) {
        const div = document.createElement("div");
        div.innerHTML = `<span style="color: #aaa">[SYSTEM] Sound effects ${status}</span>`;
        output.appendChild(div);
        output.scrollTop = output.scrollHeight;
      }
    }
  },
};
