class NguoiChoi {
    constructor(mapObject, batDauCot, batDauHang, tenSkin, mainGameLogic) {
        this.map = mapObject; 
        this.gameLogic = mainGameLogic;
        this.cot = batDauCot;
        this.hang = batDauHang;
        this.skin = tenSkin;
        this.hp = 3;
        this.soBomToiDa = 2;
        this.tamNo = 5;
        this.soBomDaDat = 0;
        this.dangBatTuNgan = false;
        
        this.elNguoiChoi = document.createElement('div');
        this.elNguoiChoi.classList.add('doi-tuong-dong'); 
        this.elNguoiChoi.classList.add('nguoi-choi');
        
        this.capNhatHinhAnh('dung-yen');
        this.capNhatViTriDOM();
        this.map.elBanDo.appendChild(this.elNguoiChoi);
    }

    capNhatViTriDOM() {
        const x = this.cot * KICH_THUOC_O;
        const y = this.hang * KICH_THUOC_O;
        this.elNguoiChoi.style.transform = `translate(${x}px, ${y}px)`;
    }

    capNhatHinhAnh(trangThai) {
        const urlHinhAnh = `assets/hinhAnh/nhanVat/${this.skin}/${trangThai}.png`;
        this.elNguoiChoi.style.backgroundImage = `url('${urlHinhAnh}')`;
    }

    diChuyen(huong) {
        let cotMoi = this.cot;
        let hangMoi = this.hang;

        switch (huong) {
            case 'len': hangMoi--; break;
            case 'xuong': hangMoi++; break;
            case 'trai': cotMoi--; break;
            case 'phai': cotMoi++; break;
        }

        this.capNhatHinhAnh(huong);

        if (!this.map.kiemTraVatCan(cotMoi, hangMoi)) {
            if (!this.gameLogic.kiemTraVaChamVoiBom(cotMoi, hangMoi)) {
                this.cot = cotMoi;
                this.hang = hangMoi;
                this.capNhatViTriDOM();
            }
        }
    }

    datBom() {
        if (this.soBomDaDat < this.soBomToiDa) {
            if (this.gameLogic.kiemTraVaChamVoiBom(this.cot, this.hang)) {
                return null; 
            }
            this.soBomDaDat++;
            return { cot: this.cot, hang: this.hang };
        }
        return null;
    }

    traLaiBom() {
        if (this.soBomDaDat > 0) this.soBomDaDat--;
    }

    nhanSatThuong() {
        if (this.dangBatTuNgan) return;
        this.hp--;
        this.gameLogic.capNhatHUD_HP(this.hp);
        
        if (this.hp <= 0) {
            this.gameLogic.ketThucGame('thua');
        } else {
            this.dangBatTuNgan = true;
            this.elNguoiChoi.classList.add('nhap-nhay');
            setTimeout(() => {
                this.dangBatTuNgan = false;
                this.elNguoiChoi.classList.remove('nhap-nhay');
            }, 1500);
        }
    }
    
    anVatPham(loaiVatPham) {
        if (loaiVatPham === 'hoi-hp' && this.hp < 3) this.hp++;
        else if (loaiVatPham === 'them-bom' && this.soBomToiDa < 3) this.soBomToiDa = 3;
    }

    xoa() {
        if (this.elNguoiChoi && this.elNguoiChoi.parentElement) {
            this.elNguoiChoi.remove();
        }
    }
}