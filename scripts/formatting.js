const letterSize = {
    width:8.5,
    height:11
};

class format {
    constructor(leftMargin, rightMargin) {
        this.leftMargin = leftMargin;
        this.rightMargin = rightMargin;
        this.width = letterSize.width - (leftMargin + rightMargin);
    }
};

let formats = {
    pageIndicator: new format(7.5, 0),
    action: new format(1.5, 1),
    heading: new format(1.5, 1),
    dialogue: new format(2.9, 2.3),
    cue: new format(4.2, 1),
    parenthetical: new format(3.6, 2.9),
    transition: new format(6, 1),
    inTransition: new format(1.5, 1), // Fade ins are put on the action margin.
};