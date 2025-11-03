class VuNo {
    constructor(mapObject, mainGame, cot, hang) {
        this.map = mapObject;
        this.main = mainGame;
        this.cot = cot;
        this.hang = hang;
        this.thoiGianTonTai = 400; // 0.4 giay
        
        // Kiem tra xem o nay co nam trong ban do khong
        if (cot < 0 || cot >= SO_COT || hang < 0 || hang >= SO_HANG) {
            return; // Khong tao vu no ngoai ban do
        }
        
        // Tao DOM element
        this.elVuNo = document.createElement('div');
        this.elVuNo.classList.add('doi-tuong-dong', 'vu-no');
        this.elVuNo.style.backgroundImage = `url('assets/hinhAnh/hieuUng/vu-no.png')`;

        // Su dung KICH_THUOC_O tu config.js
        const x = this.cot * KICH_THUOC_O;
        const y = this.hang * KICH_THUOC_O;
        this.elVuNo.style.transform = `translate(${x}px, ${y}px)`;
        
        this.map.elBanDo.appendChild(this.elVuNo);
        
        // Kiem tra va cham ngay khi xuat hien
        this.kiemTraVaChamTaiCho();
        
        // Tu dong xoa sau khi het thoi gian ton tai
        setTimeout(() => {
            if (this.elVuNo.parentElement) {
                this.elVuNo.remove();
            }
        }, this.thoiGianTonTai);
    }
    
    /** Kiem tra xem vu no nay co trung vao doi tuong nao khong */
    kiemTraVaChamTaiCho() {
        // 1. Kiem tra va pha huy Da Mem
        this.map.phaHuyDaMem(this.cot, this.hang);
        
        // 2. Kiem tra va cham voi Nguoi Choi
        this.main.kiemTraVaChamVuNoVoiNguoiChoi(this.cot, this.hang);
        
        // 3. Kiem tra va cham voi Quai Vat
        this.main.kiemTraVaChamVuNoVoiQuaiVat(this.cot, this.hang);
        
        // 4. Kiem tra va cham voi Bom khac (no day chuyen)
        this.main.kiemTraVaChamVuNoVoiBom(this.cot, this.hang);
    }
}