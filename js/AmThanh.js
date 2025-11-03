// Module quan ly toan bo am thanh trong game
class QuanLyAmThanh {
    constructor() {
        // Bien kiem tra tuong tac (de vuot qua chinh sach trinh duyet)
        this.daTuongTac = false;

        // Tai nhac nen
        this.nhacNenGame = new Audio(); // Nhac trong game
        this.nhacNenGame.loop = true;
        
        this.nhacNenMenu = new Audio('assets/amThanh/nhacNen/nhac-menu.mp3'); // (DA THEM) Nhac menu
        this.nhacNenMenu.loop = true;
        
        // Tai hieu ung am thanh
        this.hieuUng = {
            'dat-bom': new Audio('assets/amThanh/hieuUng/dat-bom.mp3'),
            'no': new Audio('assets/amThanh/hieuUng/no.mp3'),
            'an-vat-pham': new Audio('assets/amThanh/hieuUng/an-vat-pham.mp3'),
            'chet': new Audio('assets/amThanh/hieuUng/chet.mp3'),
            'bam-nut': new Audio('assets/amThanh/hieuUng/bam-nut.mp3')
        };
        
        // Dat am luong mac dinh
        this.capNhatAmLuongNhac(0.8); // Mac dinh 80%
        this.capNhatAmLuongHieuUng(1.0); // Mac dinh 100%
    }

    // Duoc goi khi nguoi dung click "Bat Dau" lan dau tien
    khoiDongTuongTac() {
        if (this.daTuongTac) return;
        this.daTuongTac = true;
        // Phat mot am thanh ngan de "mo khoa"
        this.hieuUng['bam-nut'].play();
        // Dong thoi bat dau phat nhac menu
        this.phatNhacMenu();
    }
    
    // Phat nhac menu
    phatNhacMenu() {
        if (!this.daTuongTac) return; // Chua click thi chua phat
        this.dungNhacGame(); // Tat nhac game (neu co)
        this.nhacNenMenu.play();
    }

    phatNhacGame(tenMoiTruong) {
        if (!this.daTuongTac) return; 
        
        this.dungNhacMenu(); // Tat nhac menu
        
        this.nhacNenGame.src = `assets/amThanh/nhacNen/nhac-${tenMoiTruong}.mp3`;
        this.nhacNenGame.play();
    }

    dungNhacMenu() {
        this.nhacNenMenu.pause();
        this.nhacNenMenu.currentTime = 0; // Tua ve dau
    }
    
    dungNhacGame() {
        this.nhacNenGame.pause();
        this.nhacNenGame.currentTime = 0; // Tua ve dau
    }

    phatHieuUng(tenHieuUng) {
        if (!this.daTuongTac) return;
        
        if (this.hieuUng[tenHieuUng]) {
            this.hieuUng[tenHieuUng].currentTime = 0;
            this.hieuUng[tenHieuUng].play();
        }
    }

    capNhatAmLuongNhac(giaTri) { // giaTri tu 0 den 1
        this.nhacNenMenu.volume = giaTri;
        this.nhacNenGame.volume = giaTri;
    }

    capNhatAmLuongHieuUng(giaTri) { // giaTri tu 0 den 1
        for (const ten in this.hieuUng) {
            this.hieuUng[ten].volume = giaTri;
        }
    }
}