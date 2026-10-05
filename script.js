const treeData = {
    name: "Matematika Diskrit",
    children: [
        {
            name: "Pertemuan 8: Induksi Matematika",
            children: [
                { name: "Prinsip Induksi Sederhana" },
                { name: "Prinsip Induksi yang Dirampatkan" },
                { name: "Prinsip Induksi Kuat" }
            ]
        },
        {
            name: "Pertemuan 9: Kombinatorial",
            children: [
                { 
                    name: "Kaidah Dasar Menghitung",
                    children: [
                        { name: "Kaidah Perkalian (Rule of Product)" },
                        { name: "Kaidah Penjumlahan (Rule of Sum)" }
                    ]
                },
                { name: "Prinsip Inklusi-Eksklusi" },
                { 
                    name: "Permutasi",
                    children: [
                        { name: "Permutasi r dari n elemen" },
                        { name: "Permutasi Bentuk Umum" }
                    ]
                },
                { 
                    name: "Kombinasi",
                    children: [
                        { name: "Kombinasi r elemen dari n elemen" },
                        { name: "Kombinasi dengan Pengulangan" }
                    ]
                },
                { name: "Koefisien Binomial" }
            ]
        },
        {
            name: "Pertemuan 10: Algoritma & Teori Bilangan Bulat",
            children: [
                { 
                    name: "Algoritma",
                    children: [
                        { name: "Penyajian: Tulisan, Pseudocode, Gambar/Flowchart" }
                    ]
                },
                { 
                    name: "Sifat Pembagian Bilangan Bulat",
                    children: [
                        { name: "Teorema Euclidean" },
                        { name: "Pembagi Bersama Terbesar (PBB)" },
                        { name: "Algoritma Euclidean" },
                        { name: "Relatif Prima" }
                    ]
                },
                { 
                    name: "Aritmatika Modulo",
                    children: [
                        { name: "Kongruen & Sifat Aritmatika Modulo" },
                        { name: "Invers Modulo" },
                        { name: "Kongruen Linier" }
                    ]
                },
                { 
                    name: "Bilangan Prima",
                    children: [
                        { name: "Teori Fundamental Aritmatik" }
                    ]
                },
                { 
                    name: "Kriptografi",
                    children: [
                        { name: "Plainteks, Cipherteks, Enkripsi, Dekripsi" },
                        { name: "DES (Data Encryption Standard)" },
                        { name: "Algoritma RSA" }
                    ]
                },
                { name: "ISBN dan Karakter Uji" }
            ]
        },
        {
            name: "Pertemuan 11: Graf 1",
            children: [
                { name: "Definisi Graf" },
                { name: "Jenis-jenis Graf" },
                { name: "Terminologi Graf (Derajat, Gelang, dll)" },
                { name: "Beberapa Graf Khusus" },
                { name: "Representasi Graf" },
                { name: "Graf Isomorfik" }
            ]
        },
        {
            name: "Pertemuan 12: Graf 2",
            children: [
                { 
                    name: "Graf Planar dan Graf Bidang",
                    children: [
                        { name: "Rumus Euler" },
                        { name: "Ketidaksamaan Euler" }
                    ]
                },
                { name: "Teorema Kuratowski" },
                { name: "Lintasan dan Sirkuit Euler" },
                { name: "Lintasan dan Sirkuit Hamilton" },
                { 
                    name: "Penerapan Graf",
                    children: [
                        { name: "Persoalan Pedagang Keliling (TSP)" },
                        { name: "Persoalan Tukang Pos Cina" },
                        { name: "Pewarnaan Graf" },
                        { name: "Bilangan Kromatik" }
                    ]
                }
            ]
        },
        {
            name: "Pertemuan 13-14: Pohon (Tree)",
            children: [
                { name: "Definisi Pohon dan Hutan" },
                { name: "Sifat-sifat Pohon" },
                { 
                    name: "Pohon Berakar (Rooted Tree)",
                    children: [
                        { name: "Terminologi (Akar, Daun, dll)" }
                    ]
                },
                { 
                    name: "Pohon Biner (Binary Tree)",
                    children: [
                        { name: "Penelusuran (PreOrder, InOrder, PostOrder)" },
                        { name: "Pohon Pencarian Biner (BST)" }
                    ]
                },
                { 
                    name: "Pohon Merentang (Spanning Tree)",
                    children: [
                        { name: "Minimum Spanning Tree (MST)" },
                        { name: "Algoritma Prim" },
                        { name: "Algoritma Kruskal" }
                    ]
                }
            ]
        }
    ]
};

const container = document.getElementById('mindmap-container');
const margin = { top: 60, right: 20, bottom: 20, left: 20 };
let width = container.clientWidth;
let height = container.clientHeight;

const nodeHeight = 36;
let i = 0;

const zoom = d3.zoom()
    .scaleExtent([0.1, 3]) // Limit zoom out diperkecil agar bisa melihat keseluruhan pohon vertikal
    .on("zoom", (event) => {
        svgGroup.attr("transform", event.transform);
    });

const svg = d3.select("#mindmap-container").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(zoom);

const svgGroup = svg.append("g");

// [UPDATE]: nodeSize mengatur spasi X (horizontal) dan Y (vertikal). Lebar horizontal harus besar agar antar kotak tidak tabrakan
const treeLayout = d3.tree().nodeSize([350, 150]); 

let root = d3.hierarchy(treeData, d => d.children);
root.x0 = 0;
root.y0 = 0;

// [UPDATE]: Geser posisi awal ke tengah atas (width / 2) alih-alih di pinggir kiri
const initialScale = 0.5;
const initialTransform = d3.zoomIdentity
    .translate(width / 2, margin.top) 
    .scale(initialScale);
svg.call(zoom.transform, initialTransform);

function update(source) {
    const treeDataLayout = treeLayout(root);
    const nodes = treeDataLayout.descendants();
    const links = treeDataLayout.descendants().slice(1);

    // [UPDATE]: Menentukan jarak vertikal antar kedalaman (level)
    nodes.forEach(d => { d.y = d.depth * 150; });

    const node = svgGroup.selectAll('g.node')
        .data(nodes, d => d.id || (d.id = ++i));

    // [UPDATE]: Gunakan translasi (x, y) bukan (y, x) karena sumbu sudah diputar
    const nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${source.x0},${source.y0})`)
        .on('click', click);

    nodeEnter.append('rect')
        .attr('y', -nodeHeight / 2)
        .attr('height', nodeHeight)
        .attr('rx', 6)
        .attr('ry', 6);

    // [UPDATE]: Gunakan text-anchor middle agar teks rata tengah, buang offset X
    nodeEnter.append('text')
        .attr('dy', '0.35em')
        .style('text-anchor', 'middle') 
        .text(d => d.data.name)
        .each(function(d) {
            d.bbox = this.getBBox();
        });

    // [UPDATE]: Atur X dari kotak menjadi negatif separuh lebarnya agar kotak berada tepat di tengah koordinat
    nodeEnter.selectAll('rect')
        .attr('width', d => d.bbox.width + 32)
        .attr('x', d => -(d.bbox.width + 32) / 2);

    const nodeUpdate = nodeEnter.merge(node);
    
    nodeUpdate.select('text')
        .each(function(d) {
            d.bbox = this.getBBox();
        });

    nodeUpdate.select('rect')
        .attr('width', d => d.bbox ? d.bbox.width + 32 : 100)
        .attr('x', d => d.bbox ? -(d.bbox.width + 32) / 2 : -50);

    // [UPDATE]: Translasi menggunakan (x, y)
    nodeUpdate.transition()
        .duration(600)
        .attr('transform', d => `translate(${d.x},${d.y})`);

    const nodeExit = node.exit().transition()
        .duration(600)
        .attr('transform', d => `translate(${source.x},${source.y})`)
        .remove();

    nodeExit.select('rect').attr('width', 0).attr('x', 0);
    nodeExit.select('text').style('fill-opacity', 1e-6);

    const link = svgGroup.selectAll('path.link')
        .data(links, d => d.id);

    const linkEnter = link.enter().insert('path', 'g')
        .attr('class', 'link')
        .style('opacity', 0)
        .attr('d', d => {
            const o = { x: source.x0, y: source.y0 };
            return diagonal(o, o);
        });

    const linkUpdate = linkEnter.merge(link);

    linkUpdate.transition()
        .duration(600)
        .style('opacity', 1)
        .attr('d', d => diagonal(d.parent, d));

    link.exit().transition()
        .duration(600)
        .style('opacity', 0)
        .attr('d', d => {
            const o = { x: source.x, y: source.y };
            return diagonal(o, o);
        })
        .remove();

    nodes.forEach(d => {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

// [UPDATE]: Fungsi diagonal diubah agar garis ditarik dari Bawah Parent ke Atas Child
function diagonal(s, d) {
    // startX dan startY adalah titik bawah kotak Parent
    const startX = s.x;
    const startY = s.y + (s.y === d.y ? 0 : nodeHeight / 2);
    
    // endX dan endY adalah titik atas kotak Child
    const endX = d.x;
    const endY = d.y - (s.y === d.y ? 0 : nodeHeight / 2);
    
    // Tarik kurva bezier melengkung dari atas ke bawah (Vertikal)
    return `M ${startX} ${startY}
            C ${startX} ${(startY + endY) / 2},
                ${endX} ${(startY + endY) / 2},
                ${endX} ${endY}`;
}

function click(event, d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    update(d);
}

update(root);