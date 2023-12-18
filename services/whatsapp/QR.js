module.exports = class QR {
    base64;
    raw;

    save(base64, raw) {
        this.base64 = base64.replace(/^data:image\/png;base64,/, '');
        this.raw = raw;
    }

    get() {
        if (this.base64) {
            return Buffer.from(this.base64, 'base64');
        }
        return false
    }
}