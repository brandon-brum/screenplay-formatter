class screenPlay {
    constructor(raw='', characters='') {
        this.lines = raw.split('\n');
        this.characters = characters.split('\n')
    }
    createPDF() {
        this.doc = new jspdf.jsPDF({
            orientation: 'p',
            unit: 'in',
            format: 'letter',
            lineHeight: 1,
        });
        this.doc.setFontSize(11);
        this.doc.setFont('Courier');
        let lineNumber = 1;
        let pageNumber = 1;
        this.write.pageIndicator();
    }

    getLinePurpose(line) {
        switch(line) {
            case /^(\w|\.|\-* *)*\/?( \((\w|\.)*\))?$/.test(line): // Use a website like regextester to decode this.
                this.afterCue = true
                return 'cue'
            case /^(.*)$/:
                return 'parenthetical'
            case /^(\S* )*\w*:$/.test(line):
                this.afterCue = false
                return 'transition'
            case this.afterCue: // Any blocks of text after character cues are assumed to be dialogue.
                this.afterCue = false 
                return 'dialogue'
            default:
                return 'action'
        }
    }

    corrections = {}

    write = {
        pageIndicator: () => this.doc.text(formats.pageIndicator.leftMargin, 0.5, `${this.pageNumber}.`, { align: 'right' }),
        action: text => this.doc.text(formats.action.leftMargin, this.pageNumber + 1, text, { maxWidth:formats.action.width }),
        dialogue: text => this.doc.text(formats.dialogue.leftMargin, this.pageNumber + 1, text, { maxWidth:formats.dialogue.width }),
        cue: text => this.doc.text(formats.cue.leftMargin, this.pageNumber + 1, text, { maxWidth:formats.cue.width }),
        parenthetical: text => this.doc.text(formats.parenthetical.leftMargin, this.pageNumber + 1, text, { maxWidth:formats.parenthetical.width }),
        transition: text => this.doc.text(formats.transition.leftMargin, this.pageNumber + 1, text, { maxWidth:formats.transition.width })
    };

    get raw() {return this.lines.join('\n')}
}