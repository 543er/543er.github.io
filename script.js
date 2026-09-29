// ========================================================
// 🛠️ ÚDAJE DOPLNĚNY AUTOMATICKY PODLE TVÉHO OBRÁZKU:
// ========================================================
const GITHUB_USER = "543er"; 
const GITHUB_REPO = "543er.github.io";           
const FOLDER_PATH = ""; // Soubory jsou přímo v hlavním adresáři
// ========================================================

const apiUrl = `https://github.com{GITHUB_USER}/${GITHUB_REPO}/contents/${FOLDER_PATH}`;

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function loadFiles() {
    const listElement = document.getElementById("file-list");
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Chyba: Zkontroluj své GitHub jméno a název repozitáře.`);
        }
        
        const data = await response.json();
        listElement.innerHTML = ""; 

        // Filtrování souborů v hlavním adresáři
        const files = data.filter(item => {
            const name = item.name.toLowerCase();
            const isFile = item.type === "file";
            
            // Ignorujeme webové soubory a README, aby se nezobrazovaly v seznamu
            const isIndexHtml = name === "index.html";
            const isScriptJs = name === "script.js";
            const isGitIgnore = name === ".gitignore";
            const isReadme = name === "readme.md";
            
            return isFile && !isIndexHtml && !isScriptJs && !isGitIgnore && !isReadme;
        });

        if (files.length === 0) {
            listElement.innerHTML = "<li>V adresáři momentálně nejsou žádné další soubory ke stažení.</li>";
            return;
        }

        files.forEach(file => {
            const li = document.createElement("li");
            
            const a = document.createElement("a");
            a.href = file.download_url; 
            a.setAttribute("download", file.name); 
            a.textContent = `📥 ${file.name}`;
            
            const span = document.createElement("span");
            span.className = "size";
            span.textContent = formatBytes(file.size);
            
            li.appendChild(a);
            li.appendChild(span);
            listElement.appendChild(li);
        });

    } catch (error) {
        listElement.innerHTML = `<li style="color: red; font-weight: bold;">${error.message}</li>`;
    }
}

// Spustí funkci po načtení stránky
loadFiles();
