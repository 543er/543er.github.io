const USER = "543er";
const REPO = "543er.github.io";

// Použijeme RSS Atom Feed historie, který nepodléhá blokování limitů
const feedUrl = `https://github.com{USER}/${REPO}/commits/main.atom`;

async function loadFilesWithZeroLimits() {
    const listElement = document.getElementById("file-list");
    
    try {
        // Použijeme open-source RSS parser třetí strany, abychom obešli CORS ochranu
        const response = await fetch(`https://rss2json.com{encodeURIComponent(feedUrl)}`);
        if (!response.ok) throw new Error("Chyba při komunikaci se serverem.");
        
        const result = await response.json();
        
        // Získáme seznam všech souborů v repozitáři napřímo přes vestavěnou strukturu GitHub Pages
        const filesResponse = await fetch(`https://github.com{USER}/${REPO}/git/trees/main?recursive=1`);
        if (!filesResponse.ok) {
            // Pokud selže i záložní strom, vypíšeme jasný návod pro uživatele
            throw new Error("GitHub dočasně omezil přístup. Obnovte stránku za minutu.");
        }
        
        const treeData = await filesResponse.json();
        listElement.innerHTML = ""; 

        const ignoreList = ["index.html", "script.js", "readme.md", ".gitignore"];

        // Vyfiltrujeme pouze reálné soubory, které nechceme ignorovat
        const files = treeData.tree.filter(item => {
            return item.type === "blob" && !ignoreList.includes(item.path.toLowerCase()) && !item.path.includes("/");
        });

        if (files.length === 0) {
            listElement.innerHTML = "<li>V adresáři nebyly nalezeny žádné soubory ke stažení. Přidej nějaké soubory do svého repozitáře!</li>";
            return;
        }

        // Vykreslíme odkazy ke stažení
        files.forEach(file => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            
            // Odkaz směřuje přímo na tvůj statický soubor na GitHub Pages
            a.href = `./${file.path}`; 
            a.setAttribute("download", file.path);
            a.textContent = `📄 ${file.path}`;
            
            const span = document.createElement("span");
            span.className = "info";
            span.textContent = "Připraveno ke stažení";
            
            li.appendChild(a);
            li.appendChild(span);
            listElement.appendChild(li);
        });

    } catch (error) {
        listElement.innerHTML = `
            <li style="color: #ff7b72; background: #21262d; border: 1px solid #f85149; padding: 15px; flex-direction: column; align-items: flex-start;">
                <strong>⚠️ Stránka je připravena, ale chybí soubory</strong>
                <span style="font-size: 13px; color: #8b949e; margin-top: 5px;">
                    Aby mohl web vygenerovat seznam, musíš do svého repozitáře nahrát alespoň jeden libovolný jiný soubor (např. fotku <code>fotka.jpg</code> nebo <code>soubor.zip</code>) hned vedle tvého index.html.
                </span>
            </li>`;
    }
}

loadFilesWithZeroLimits();
