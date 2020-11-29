export default Ctl;
declare class Ctl {
    addCtl(aniChart: any): void;
    ctlCurrentFrame: import("d3-selection").Selection<HTMLInputElement, any, HTMLElement, any>;
    slider: HTMLInputElement;
    updateCtl(aniChart: any): void;
    updateCtlCFrame(aniChart: any): void;
}
