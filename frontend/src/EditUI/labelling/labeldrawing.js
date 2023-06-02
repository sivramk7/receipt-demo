import BaseDrawing from "./basedrawing";
import {defaultRectOptions} from "../const";


export default class LabelDrawing extends BaseDrawing {
  constructor(canvas, fabric, type, updateShow) {
    super(canvas, fabric, type);
    this.updateShow = updateShow;
    
    
  }

  closedtextDialog(clstext){
    if (clstext == null || clstext === ""){
      const objs = this.rectObjects.filter(item=>item.index === this.objid);
      if (objs.length > 0){
        this.canvas.remove(objs[0]);
      }
    }
    else {
      const locate = this.locationLstObject;
      if (locate !== null){
        let text = new this.fabric.IText(
          clstext, 
          {
          fontFamily: 'sans-serif',
          fontSize:18,
          fontWeight: 'Bold',
          fill: '#d92872',
          left: locate.x,
          top: locate.y - 20,
          index: this.objid,
          type: 'text',
        });
        this.canvas.add(text);
      }
    }
    this.__setDrawing(true);
    this.canvas.renderAll();
  }
  // MOuse move cb
  _onMouseMoveCallback(e) {
    
    if (!this.activeObject) {
      return;
    }
    console.log(this.drawing);
    console.log(this.objid);
    // if (this.objid == null || this.objid > 0){
    //   return;
    // }
    if (!this.drawing){
      return;
    }
    console.log("_onMouseMoveCallback");
    const pointer = this.canvas.getPointer(e);
    if (pointer.x < this.origX) {
      this.activeObject.set("left", pointer.x);
    }
    if (pointer.y < this.origY) {
      this.activeObject.set("top", pointer.y);
    }
    this.activeObject.set({
      width: Math.abs(pointer.x - this.origX),
      height: Math.abs(pointer.y - this.origY)
    });
    this.activeObject.setCoords();
    this.canvas.renderAll();
  }

  // mouse down cb
  _onMouseDownCallback(e) {
    console.log(this.drawing);
    console.log(this.objid);
    if (!this.drawing){
      return;
    }
    console.log("_onMouseDownCallback");
      const pointer = this.canvas.getPointer(e);
      this.origX = pointer.x;
      this.origY = pointer.y;
      let index = this.rectObjects.length + 1;
      const rect = new this.fabric.Rect({
        ...defaultRectOptions,
        left: this.origX,
        top: this.origY,
        width: 0,
        height: 0,
        type: "region",
        index:index,
        selectionBackgroundColor: "rgba(245, 245, 220, 0.5)"
      });

      this.canvas.add(rect);
      this.canvas.setActiveObject(rect);
      return;
  }


  // mouse up cb
  _onMouseUpCallback(e) {
    if (!this.drawing){
      return;
    }
    this.__lockObjects(this.rectObjects, true);
    
    let index = this.activeObject.get("index");
    let x = this.activeObject.get("left") + this.activeObject.get("width");
    let y = this.activeObject.get("top") + this.activeObject.get("height");
    this.canvas.discardActiveObject(this.activeObject).renderAll();
    let b = true;
    setTimeout(() => {
      if (this.activeObject && this.activeObject.get("width") < 10) {
        this.canvas.remove(this.activeObject);
        b = false;
      }
    }, 100);
    
    if (b){
      let menux = x+this.canvas._offset.left;
      let menuy = y+this.canvas._offset.top;
      menux = (menux + 300 > window.innerWidth) ? window.innerWidth - 300 : menux;
      // menuy = (menuy + 400 > window.innerHeight) ? window.innerHeight - 400 : menuy; 
      this.updateShow(true, menux, menuy);
      this.objid = index;
      this.__setDrawing(false);
      console.log("_onMouseUpCallback");
    }
    else {
      this.objid = 0;
    }
    // this.__lockObjects(this.objects, false);
  }
}
