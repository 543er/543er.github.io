// Konfigurace tvého repozitáře (převzato z tvého obrázku)
const USER = "543er";
const REPO = "543er.github.io";

// Přímá URL adresa GitHub API pro výpis souborů z hlavní složky
const url = `https://github.com{USER}/${REPO}/contents/`;

async function getFiles() {
    const list = document.getElementById("file-list");
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Nepodařilo se spojit s GitHubem.");
        
        const data = await response.json();
        list.innerHTML = ""; // Vyčistit text "Načítám..."

        // Seznam souborů, které nechceme na webu ukazovat
        const ignoreList = ["index.html", "script.js", "readme.md", ".gitignore"];

        // Vyfiltrování pouze povolených souborů
        const files = data.filter(item => {
            return item.type === "file" && !ignoreList.includes(item.name.toLowerCase());
        });

        if (files.length === 0) {
            list.innerHTML = "<li>V adresáři zatím nejsou žádné soubory ke stažení. Nahrávej je vedle index.html!</li>";
            return;
        }

        // Vykreslení odkazů na stránku
        files.forEach(file => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            
            // Stahujeme přímo z produkční adresy tvého webu, což obchází CORS chyby
            a.href = `./${file.name}`; 
            a.setAttribute("download", file.name);
            a.textContent = `📥 ${file.name}`;
            
            const span = document.createElement("span");
            span.className = "info-text";
            span.textContent = "Kliknutím stáhneš";
            
            li.appendChild(a);
            li.appendChild(span);
            list.appendChild(li);
        });

    } catch (error) {
        list.innerHTML = `<li style="color: red; font-weight: bold; background: #fff5f5; border: 1px solid #ffc9c9; padding: 12px; border-radius: 6px;">
            Došlo k chybě: ${error.message}<br>
            <span style="font-size: 12px; font-weight: normal; color: #666;">Tip: Ujisti se, že jsi do repozitáře nahrál i nějaký jiný soubor než index.html a script.js.</span>
        </li>`;
    }
}

getFiles();
