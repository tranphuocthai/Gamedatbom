class QuaiVat {
    // Them 'laQuaiGoc' lam tham so cuoi cung
    constructor(mapObject, batDauCot, batDauHang, loaiQuai, mainGame, laQuaiGoc = false) {
        this.map = mapObject;
        this.main = mainGame;
        this.cot = batDauCot;
        this.hang = batDauHang;
        this.loaiQuai = loaiQuai;
        this.laQuaiGoc = laQuaiGoc; // Luu lai trang thai "goc"

        this.tocDoDiChuyen = 800; // 
        this.idIntervalDiChuyen = null;
        
        this.elQuaiVat = document.createElement('div');
        this.elQuaiVat.classList.add('doi-tuong-dong', 'quai-vat');
        this.id = 'quai-' + Date.now() + Math.floor(Math.random() * 1000); 
        this.elQuaiVat.id = this.id;
        
        this.capNhatHinhAnh('dung-yen');
        this.capNhatViTriDOM();
        this.map.elBanDo.appendChild(this.elQuaiVat);
        this.batDauDiChuyen();
    }
    
    capNhatViTriDOM() {
        const x = this.cot * KICH_THUOC_O;
        const y = this.hang * KICH_THUOC_O;
        this.elQuaiVat.style.transform = `translate(${x}px, ${y}px)`;
    }
    
    capNhatHinhAnh(trangThai) {
        const urlHinhAnh = `assets/hinhAnh/quaiVat/${this.loaiQuai}/${trangThai}.png`;
        this.elQuaiVat.style.backgroundImage = `url('${urlHinhAnh}')`;
    }

    batDauDiChuyen() {
        // Huy bo dem cu neu co
        if(this.idIntervalDiChuyen) clearInterval(this.idIntervalDiChuyen);
        
        this.idIntervalDiChuyen = setInterval(() => {
            this.thucHienDiChuyen();
        }, this.tocDoDiChuyen);
    }

    dungDiChuyen() {
        clearInterval(this.idIntervalDiChuyen);
    }
    
    thucHienDiChuyen() {
        const huongNgauNhien = ['len', 'xuong', 'trai', 'phai'];
        // Chon 1 huong bat ky
        const huong = huongNgauNhien[Math.floor(Math.random() * huongNgauNhien.length)];
        
        let cotMoi = this.cot;
        let hangMoi = this.hang;
        switch (huong) {
            case 'len': hangMoi--; break;
            case 'xuong': hangMoi++; break;
            case 'trai': cotMoi--; break;
            case 'phai': cotMoi++; break;
        }
        this.capNhatHinhAnh(huong);

        // Kiem tra va cham voi map
        if (!this.map.kiemTraVatCan(cotMoi, hangMoi)) {
            // Kiem tra va cham voi BOM (khong cho di xuyen bom)
            if (!this.main.kiemTraVaChamVoiBom(cotMoi, hangMoi)) {
                this.cot = cotMoi;
                this.hang = hangMoi;
                this.capNhatViTriDOM();
            }
        }
    }
    
    biTieuDiet() {
        this.dungDiChuyen(); 
        
        // Them hieu ung chet 
        this.elQuaiVat.style.transition = 'opacity 0.3s ease';
        this.elQuaiVat.style.opacity = 0;

        // Xoa khoi DOM sau mot thoi gian ngan
        setTimeout(() => {
            // Kiem tra neu element con ton tai
            if (this.elQuaiVat.parentElement) {
                this.elQuaiVat.remove();
            }
        }, 300); 
        
        // Thong bao cho main.js rang quai vat nay da chet
        this.main.xuLyQuaiVatChet(this.id);
    }
}