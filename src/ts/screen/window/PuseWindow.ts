import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export class PauseWindow extends druid.Branch {

    private readonly bg = new druid.Rectangle();
    private readonly txtStart = new PIXI.Text("Press start when you're ready",
        { align: "center", fill: "black", fontSize: 28 });
    readonly btnStart = new druid.Button("Start");
    private readonly windowBg = new druid.Rectangle(500, 200, 0xffffff);

    constructor() {
        super();
        this.bg.alpha = 0.4;
        this.addChild(this.bg);

        this.txtStart.position.set(this.windowBg.width / 2, this.windowBg.height / 3);
        this.txtStart.anchor.set(0.5, 0.5);
        this.windowBg.addChild(this.txtStart);
        this.btnStart.position.set(this.windowBg.width / 2, this.windowBg.height * 2 / 3);
        this.btnStart.pivot.set(this.btnStart.width / 2, this.btnStart.height / 2);
        this.windowBg.addChild(this.btnStart);
        this.windowBg.pivot.set(this.windowBg.width / 2, this.windowBg.height / 2);
        this.addChild(this.windowBg);
    }

    resize(width: number, height: number) {
        this.bg.width = width;
        this.bg.height = height;
        this.windowBg.position.set(width / 2, height / 2);
    }
}
