class screenPlay {
    constructor(raw='', characters='') {
        this.lines = raw.split('\n')
            .filter(line => line); // Removes empty lines
        this.characters = characters.split('\n')
    }
    createPDF() {
        this.lineOffset = 0.2;
        this.doc = new jspdf.jsPDF({
            orientation: 'p',
            unit: 'in',
            format: 'letter',
            lineHeight: 1
        });
        this.doc.setFontSize(11);
        this.doc.setFont("Courier", "", "bold");
        this.pageNumber = 1;
        this.lineNumber = 1;
        
        this.write.pageIndicator();
        this.lines.map(line => {
            let linePurpose = this.getLinePurpose(line);
            let textHeight = this.doc.splitTextToSize(line, formats[linePurpose].width).length;
            if (['cue','action','transition'].includes(linePurpose))
                this.lineNumber++;
            if (this.lineNumber > 55)
                this.add.page();
            this.write[linePurpose](line);
            this.lineNumber += textHeight;
        });
        document.querySelector('a').href = URL.createObjectURL(this.doc.output('blob'));
        document.querySelector('a').style.display = 'block';
    }

    getLinePurpose(line) {
        if (/^(\w|\.|\-* *)*\/?( \((\w|\.)*\))?$/.test(line)) { // Use a website like regextester to decode this.
            this.afterCue = true;
            return 'cue';
        } else if (/^\(.*\)$/.test(line)) {
            return 'parenthetical';
        } else if (/^(\S* )*\w*:$/.test(line)) {
            this.afterCue = false;
            return line.toUpperCase().includes('IN') ? 'inTransition' : 'transition';
        } else if (this.afterCue) {// Any blocks of text after character cues are assumed to be dialogue.
            this.afterCue = false ;
            return 'dialogue';
        } else {
            return 'action';
        }
    }

    corrections = {};

    write = {
        pageIndicator: () => this.doc.text(`${this.pageNumber}.`, formats.pageIndicator.leftMargin, 0.5, { align: 'right' }),
        action: text => this.doc.text(text, formats.action.leftMargin, this.lineOffset * this.lineNumber + 1, { maxWidth:formats.action.width }),
        dialogue: text => this.doc.text(text, formats.dialogue.leftMargin, this.lineOffset * this.lineNumber + 1, { maxWidth:formats.dialogue.width }),
        cue: text => this.doc.text(text, formats.cue.leftMargin, this.lineOffset * this.lineNumber + 1, { maxWidth:formats.cue.width }),
        parenthetical: text => this.doc.text(text, formats.parenthetical.leftMargin, this.lineOffset * this.lineNumber + 1, { maxWidth:formats.parenthetical.width }),
        transition: text => this.doc.text(text, formats.transition.leftMargin, this.lineOffset * this.lineNumber + 1, { maxWidth:formats.transition.width }),
        inTransition: text => this.doc.text(text, formats.inTransition.leftMargin, this.lineOffset * this.lineNumber + 1, { maxWidth:formats.inTransition.width })
    };

    add = {
        page: () => {
            this.write.pageIndicator();
            this.pageNumber++;
            this.doc.addPage('letter', 'p');
            this.lineNumber = 1;
        },
    };

    get raw() {return this.lines.join('\n')}
}