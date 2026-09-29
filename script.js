// ========================================================
// 🛠️ ÚDAJE PODLE TVÉHO OBRÁZKU (POZOR NA VELKÁ/MALÁ PÍSMENA):
// ========================================================
const GITHUB_USER = "543er"; 
const GITHUB_REPO = "543er.github.io";           
const FOLDER_PATH = ""; // Zůstává prázdné
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
        
        // Zde odchytíme přesný typ chyby, pokud API selže
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Chyba 404: Repozitář nebylo možné najít. Zkontroluj, zda se přesně jmenuje "${GITHUB_REPO}".`);
            } else if (response.status === 403) {
                throw new Error(`Chyba 403: Překročen limit požadavků GitHubu. Počkej chvíli.`);
            } else {
                throw new Error(`Chyba serveru: Status ${response.status}`);
            }
        }
        
        const data = await response.json();
        listElement.innerHTML = ""; 

        // Pokud je repozitář úplně prázdný (neobsahuje soubory)
        if (!Array.isArray(data)) {
            listElement.innerHTML = "<li>V adresáři nebyly nalezeny žádné soubory.</li>";
            return;
        }

        const files = data.filter(item => {
            const name = item.name.toLowerCase();
            const isFile = item.type === "file";
            
            const isIndexHtml = name === "index.html";
            const isScriptJs = name === "script.js";
            const isGitIgnore = name === ".gitignore";
            const isReadme = name === "readme.md";
            
            return isFile && !isIndexHtml && !isScriptJs && !isGitIgnore && !isReadme;
        });

        if (files.length === 0) {
            listElement.innerHTML = "<li>Do adresáře jsi zatím nenahrál žádné soubory ke stažení. Nahrávej soubory vedle index.html!</li>";
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
        listElement.innerHTML = `<li style="color: red; font-weight: bold; background: #fff5f5; border: 1px solid #ffc9c9;">${error.message}</li>`;
    }
}

loadFiles();
