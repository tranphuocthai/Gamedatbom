class Bom {
    constructor(mapObject, nguoiChoiDat, mainGame, cot, hang) {
        this.map = mapObject;
        this.nguoiChoi = nguoiChoiDat;
        this.main = mainGame;
        this.cot = cot;
        this.hang = hang;
        this.thoiGianNo = 2000; 
        this.idTimeoutNo = null; // De luu tru bo dem no
        
        // Tạo BOM 
        this.elBom = document.createElement('div');
        this.elBom.classList.add('doi-tuong-dong', 'bom');
        this.elBom.style.backgroundImage = `url('assets/hinhAnh/hieuUng/bom.png')`;
        this.id = `bom-${hang}-${cot}`;
        this.elBom.id = this.id;

        // Su dung KICH_THUOC_O tu config.js 
        const x = this.cot * KICH_THUOC_O;
        const y = this.hang * KICH_THUOC_O;
        
        // Dat vi tri X, Y vao bien CSS 
        this.elBom.style.setProperty('--x-pos', `${x}px`);
        this.elBom.style.setProperty('--y-pos', `${y}px`);
        
        // Ap dung transform tu bien CSS
        this.elBom.style.transform = `translate(var(--x-pos), var(--y-pos))`;
        
        this.map.elBanDo.appendChild(this.elBom);
        this.kichHoatDemNguoc();
    }
    
    kichHoatDemNguoc() {
        this.idTimeoutNo = setTimeout(() => {
            this.phatNo();
        }, this.thoiGianNo);
    }
    
    phatNo() {
        // Xoa bo dem thoi gian 
        clearTimeout(this.idTimeoutNo);
        this.idTimeoutNo = null;

        // Kiem tra xem element con ton tai khong truoc khi xoa
        if (this.elBom.parentElement) {
            this.elBom.remove();
        }
        
        this.nguoiChoi.traLaiBom();
        this.main.taoVuNo(this.cot, this.hang, this.nguoiChoi.tamNo);
        this.main.xuLyBomDaNo(this.id);
    }
    
    /* Neu mot qua bom khac no trung qua bom nay */
    biKichNo() {
        // Chi kich no neu bom van con bo dem thoi gian (chua no)
        if (this.idTimeoutNo) {
            this.phatNo();
        }
    }
}