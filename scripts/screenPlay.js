class screenPlay {
    constructor(raw) {
        this.lines = raw.split('\n');

    }
    createPDF() {
        let pdf = new jsPDF({
            orientation: 'p',
            unit: 'in',
            format: 'letter',
            lineHeight: 1,
        });
        pdf.setFontSize(11);
        pdf.setFont('Courier');
        let lineNumber = 1;
        let pageNumber = 1;
        this.write.pageIndicator();
        
    }
    write = {
        pageIndicator = () => pdf.text(7.5, 0.5, `${this.pageNumber}.`, { align: 'right' }),
        action = action => pdf.text(1.5, this.pageNumber + 1, action, {}),
    }
    get raw() {

    }
}