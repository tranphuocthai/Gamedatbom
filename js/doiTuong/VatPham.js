/* --- js/doiTuong/VatPham.js --- */

class VatPham {
    constructor(mapObject, mainGame, cot, hang, loaiVatPham) {
        this.map = mapObject;
        this.main = mainGame;
        this.cot = cot;
        this.hang = hang;
        this.loaiVatPham = loaiVatPham;

        // Tao DOM element
        this.elVatPham = document.createElement('div');
        this.elVatPham.classList.add('doi-tuong-dong', 'vat-pham');
        this.id = `vatpham-${hang}-${cot}`;
        this.elVatPham.id = this.id;
        this.elVatPham.style.backgroundImage = `url('assets/hinhAnh/vatPham/${this.loaiVatPham}.png')`;

        // Su dung KICH_THUOC_O tu config.js
        const x = this.cot * KICH_THUOC_O;
        const y = this.hang * KICH_THUOC_O;
        this.elVatPham.style.transform = `translate(${x}px, ${y}px)`;
        
        this.map.elBanDo.appendChild(this.elVatPham);
    }
    
    /** Ham nay duoc goi boi main.js khi NguoiChoi di vao o nay*/
    biAn() {
        // 1. Xoa khoi DOM
        if (this.elVatPham.parentElement) {
            this.elVatPham.remove();
        }
        
        // 2. Thong bao cho main.js rang vat pham nay da bi an
        this.main.xuLyAnVatPham(this.id, this.loaiVatPham);
    }
}