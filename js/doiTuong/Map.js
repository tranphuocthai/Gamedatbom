class Map {
    constructor(idBanDoDOM, mainGameLogic) {
        this.elBanDo = document.getElementById(idBanDoDOM);
        this.gameLogic = mainGameLogic; // De goi ham roiVatPham
        
        this.moiTruongHienTai = 'rung'; // Mac dinh
        this.mangBanDo = []; // Mang logic 2 chieu
    }

    /*
     * Ham RANDOM MOI TRUONG, RANDOM DA MEM
     */
    khoiTaoBanDo() {
        // 1. RANDOM MOI TRUONG
        this.moiTruongHienTai = DANH_SACH_MOI_TRUONG[Math.floor(Math.random() * DANH_SACH_MOI_TRUONG.length)];
        this.mangBanDo = [];
        
        let danhSachONgauNhien = [];

        // 2. Tao ban do rong (toan bo la O_DAT)
        for (let h = 0; h < SO_HANG; h++) {
            this.mangBanDo[h] = [];
            for (let c = 0; c < SO_COT; c++) {
                this.mangBanDo[h][c] = O_DAT;
            }
        }

        // 3. Tao vien DA CUNG bao quanh
        for (let h = 0; h < SO_HANG; h++) {
            this.mangBanDo[h][0] = O_DA_CUNG; // Vien trai
            this.mangBanDo[h][SO_COT - 1] = O_DA_CUNG; // Vien phai
        }
        for (let c = 1; c < SO_COT - 1; c++) {
            this.mangBanDo[0][c] = O_DA_CUNG; // Vien tren
            this.mangBanDo[SO_HANG - 1][c] = O_DA_CUNG; // Vien duoi
        }

        // 4. Tao cac cot DA CUNG co dinh (chiem ~20% map)
        for (let h = 2; h < SO_HANG - 2; h += 2) {
            for (let c = 2; c < SO_COT - 2; c += 2) {
                this.mangBanDo[h][c] = O_DA_CUNG;
            }
        }
        
        // 5. Dinh nghia cac vi tri KHONG duoc phep dat da mem (4 goc spawn)
        const viTriCam = [
            '1,1', '1,2', '2,1', // Goc Player
            '1,12', '1,13', '2,13', // Goc Quai 1
            '10,1', '11,1', '11,2', // Goc Quai 2
            '10,13', '11,12', '11,13' // Goc Quai 3
        ];

        // 6. Lay danh sach tat ca cac o co the dat DA MEM
        for (let h = 1; h < SO_HANG - 1; h++) {
            for (let c = 1; c < SO_COT - 1; c++) {
                const viTri = `${h},${c}`;
                if (this.mangBanDo[h][c] === O_DAT && !viTriCam.includes(viTri)) {
                    danhSachONgauNhien.push({ hang: h, cot: c });
                }
            }
        }
        
        // 7. Xao tron danh sach (Thuat toan Fisher-Yates)
        for (let i = danhSachONgauNhien.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [danhSachONgauNhien[i], danhSachONgauNhien[j]] = [danhSachONgauNhien[j], danhSachONgauNhien[i]];
        }
        
        // 8. Tinh toan 40% so luong da mem
        const soDaMemToiDa = Math.floor(danhSachONgauNhien.length * 0.4);
        
        // 9. Dat da mem vao ban do
        for (let i = 0; i < soDaMemToiDa; i++) {
            const o = danhSachONgauNhien[i];
            this.mangBanDo[o.hang][o.cot] = O_DA_MEM;
        }
    }

    veBanDo() {
        this.elBanDo.innerHTML = '';
        
        // Dat hinh nen chung cho moi truong
        const nenMoiTruong = `assets/hinhAnh/moiTruong/${this.moiTruongHienTai}/nen.png`;
        this.elBanDo.style.backgroundImage = `url('${nenMoiTruong}')`;
        document.getElementById('man-hinh-game').style.backgroundImage = `url('${nenMoiTruong}')`;

        // Ve cac o da
        for (let hang = 0; hang < SO_HANG; hang++) {
            for (let cot = 0; cot < SO_COT; cot++) {
                const loaiO = this.mangBanDo[hang][cot];
                
                if (loaiO !== O_DAT) {
                    const o = document.createElement('div');
                    o.classList.add('doi-tuong-dong'); // Su dung class chung
                    o.id = `o-${hang}-${cot}`;
                    
                    let hinhAnhDa = '';
                    if (loaiO === O_DA_MEM) {
                        hinhAnhDa = `da-mem-${this.moiTruongHienTai}.png`;
                    } else if (loaiO === O_DA_CUNG) {
                        hinhAnhDa = `da-cung-${this.moiTruongHienTai}.png`;
                    }
                    o.style.backgroundImage = `url('assets/hinhAnh/moiTruong/${this.moiTruongHienTai}/${hinhAnhDa}')`;
                    
                    // Dat vi tri bang TRANSFORM
                    o.style.transform = `translate(${cot * KICH_THUOC_O}px, ${hang * KICH_THUOC_O}px)`;

                    this.elBanDo.appendChild(o);
                }
            }
        }
    }

    kiemTraVatCan(cot, hang) {
        if (cot < 0 || cot >= SO_COT || hang < 0 || hang >= SO_HANG) return true;
        
        // Kiem tra o co ton tai trong mang logic khong (phong khi map bi loi)
        if (!this.mangBanDo[hang]) return true;
        
        const loaiO = this.mangBanDo[hang][cot];
        return (loaiO === O_DA_MEM || loaiO === O_DA_CUNG);
    }
    
    phaHuyDaMem(cot, hang) {
        if (!this.mangBanDo[hang] || this.mangBanDo[hang][cot] === undefined) return;
        
        if (this.mangBanDo[hang][cot] === O_DA_MEM) {
            this.mangBanDo[hang][cot] = O_DAT;
            const oCanPha = document.getElementById(`o-${hang}-${cot}`);
            if (oCanPha) oCanPha.remove();
            
            // Goi ham roi vat pham o main.js
            this.gameLogic.roiVatPham(cot, hang);
        }
    }
}