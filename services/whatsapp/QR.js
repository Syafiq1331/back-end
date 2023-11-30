module.exports = class QR {
    base64;
    raw;

    save(base64, raw) {
        this.base64 = base64.replace(/^data:image\/png;base64,/, '');
        this.raw = raw;
    }

    get() {
        return Buffer.from(this.base64, 'base64');
    }
}