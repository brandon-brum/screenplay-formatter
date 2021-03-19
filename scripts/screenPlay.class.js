class screenPlay {
    constructor(raw='', characters='') {
        this.lines = raw.split('\n')
            .filter(line => line) // Removes empty lines
            .map(line => line.trim());
        this.characters = characters.split('\n')
    }
    createPDF() {
        this.lineNumber = 0
        this.lineOffset = 0.17;
        this.doc = new jspdf.jsPDF({
            orientation: 'p',
            unit: 'in',
            format: 'letter',
            lineHeight: 1
        });
        this.doc.setFontSize(11);
        this.doc.setFont("Courier", "", "bold");
        this.pageNumber = 1;
        this.pageLine = 1;
        
        this.write.pageIndicator();
        for (let i = 0 ; i < this.lines.length ; i++) {
            setTimeout(this.drawLine.bind(this),i); // Divvy up our procedure so we don't freeze the browser.
        }
    }

    drawLine() {
        let line = this.lines[this.lineNumber]
        let linePurpose = this.getLinePurpose(line);
        let textHeight = this.doc.splitTextToSize(line, formats[linePurpose].width).length;
        if (['cue','transition','inTransition','heading'].includes(linePurpose))
            line = line.toUpperCase();
        if (['cue','action','transition','inTransition','heading'].includes(linePurpose))
            this.add.pageLines(1);
        if (this.pageLine > 55)
            this.add.page();
        this.write[linePurpose](line);
        this.add.pageLines(textHeight)

        if (this.lineNumber == this.lines.length - 1) {
            this.onFinishPDF(this.doc.output('bloburi'));
        }
        this.lineNumber++
    }

    onFinishPDF() {}

    getLinePurpose(line) {
        if (/^\(.*\)$/.test(line)) {
            return 'parenthetical';
        } else if (/^(\w|\.|\-* *)*\/?(\([\w\.]*)?[^.,?:]$/.test(line)) { // Use a website like regextester to decode this.
            this.afterCue = true;
            return 'cue';
        } else if (/^(\S* )*\w*:$/.test(line)) {
            this.afterCue = false;
            return line.toUpperCase().includes('IN') ? 'inTransition' : 'transition';
        } else if (/^.* +-/.test(line)) {
            return 'heading';
        } else if (this.afterCue) { // Any blocks of text after character cues are assumed to be dialogue.
            this.afterCue = false ;
            return 'dialogue';
        } else {
            return 'action';
        }
    }

    corrections = {};

    write = {
        pageIndicator: () => this.doc.text(`${this.pageNumber}.`, formats.pageIndicator.leftMargin, 0.5, { align: 'right' }),
        action: text => this.doc.text(text, formats.action.leftMargin, this.lineOffset * this.pageLine + 0.5, { maxWidth:formats.action.width }),
        heading: text => this.doc.text(text, formats.heading.leftMargin, this.lineOffset * this.pageLine + 0.5, { maxWidth:formats.heading.width }),
        dialogue: text => this.doc.text(text, formats.dialogue.leftMargin, this.lineOffset * this.pageLine + 0.5, { maxWidth:formats.dialogue.width }),
        cue: text => this.doc.text(text, formats.cue.leftMargin, this.lineOffset * this.pageLine + 0.5, { maxWidth:formats.cue.width }),
        parenthetical: text => this.doc.text(text, formats.parenthetical.leftMargin, this.lineOffset * this.pageLine + 0.5, { maxWidth:formats.parenthetical.width }),
        transition: text => this.doc.text(text, formats.transition.leftMargin, this.lineOffset * this.pageLine + 0.5, { maxWidth:formats.transition.width }),
        inTransition: text => this.doc.text(text, formats.inTransition.leftMargin, this.lineOffset * this.pageLine + 0.5, { maxWidth:formats.inTransition.width })
    };

    add = {
        page: () => {
            this.write.pageIndicator();
            this.pageNumber++;
            this.doc.addPage('letter', 'p');
            this.pageLine = 1;
        },
        pageLines: amount => this.pageLine += amount
    };

    get raw() {return this.lines.join('\n')}
}