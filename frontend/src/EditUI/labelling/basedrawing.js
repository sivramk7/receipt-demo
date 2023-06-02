import {defaultRectOptions} from "../const";

export default class BaseDrawing {
  /**
   *
   * @param {fabric.Canvas} canvas
   * @param {fabric} fabric
   * @param {*} type
   * @returns {void}
   * @constructor
   */
  constructor(canvas, fabric, type, anyfunc) {
    this.canvas = canvas;
    this.fabric = fabric;
    this.origX = null;
    this.origY = null;
    this.subscribed = false;
    this.type = type;
    this.setDrawingMode = this.setDrawingMode.bind(this);
    this.drawing = false;
    this._onMouseDownCallback = this._onMouseDownCallback.bind(this);
    this._onMouseMoveCallback = this._onMouseMoveCallback.bind(this);
    this._onMouseUpCallback = this._onMouseUpCallback.bind(this);
    this.__setDrawing = this.__setDrawing.bind(this);
    this.__lockObjects = this.__lockObjects.bind(this);
    this.__registerEvents = this.__registerEvents.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.objid = 0;
  }

  /**
   * (Computed)
   * Returns current canvas objects
   * @param {void}
   * @returns {Array<fabric.Object>}
   */
  get objects() {
    return this.canvas.getObjects(this.type);
  }

  
  /**
   * 
   * @returns count of 'region' type objects
   */
  get rectObjects() {
    return this.canvas.getObjects("region");
  }

  get textObjects() {
    return this.canvas.getObjects("text");
  }
  /**
   *
   * (Computed)
   * Returns current canvas active object
   * @param {void}
   * @returns {Array<fabric.Object>}
   */
  get activeObject() {
    return this.canvas.getActiveObject();
  }

  get submitData() {
    const matchedObjects = this.rectObjects.map((rect) => {
        const matchingTextObject = this.textObjects.find((text) => text.index === rect.index);
        
        if (matchingTextObject) {
          return {
            label: matchingTextObject.text,
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          };
        }
    
        return null;
      }).filter((obj) => obj !== null);
      return matchedObjects;
  }

  get locationLstObject() {
    const objs = this.rectObjects.filter(item=>item.index === this.objid);
    if (objs.length > 0) {
        return {x:objs[0].left, y:objs[0].top};
    }
    else return null;
  }
  /**
   * (Computed)
   * Returns current canvas active objects
   * @returns {Array<fabric.Object>}
   */
  get activeObjects() {
    return this.canvas.getActiveObjects();
  }

  /**
   * (Computed)
   * Returns current canvas active group
   * @returns {fabric.Group}
   */
  get activeGroup() {
    return this.canvas.getActiveGroup();
  }

  setCanvas(canvas){
    this.canvas = canvas;
    this.clearObjects();
  }

  clearRectObjects() {
    this.rectObjects.forEach(obj => {
        this.canvas.remove(obj);
    });
  }

  clearTextObjects() {
    this.textObjects.forEach(obj=>{
        this.canvas.remove(obj);
    });
  }

  clearObjects(){
    this.clearRectObjects();
    this.clearTextObjects();
    return;
  }

  clearCanvas() {
    this.canvas.clear();
  }
  
  getLabelData() {
    return this.submitData;
  }

  setPrevData(labelData){
    let index = this.rectObjects.length;
    labelData.forEach(data => {
        index = index + 1;
        const rect = new this.fabric.Rect({
            ...defaultRectOptions,
            left: data.left,
            top: data.top,
            width: data.width,
            height: data.height,
            type: "region",
            index:index,
            selectionBackgroundColor: "rgba(245, 245, 220, 0.5)"
          });
    
          this.canvas.add(rect);

        const text = new this.fabric.IText(
            data.class, 
            {
            fontFamily: 'sans-serif',
            fontSize:12,
            fill: 'yellow',
            left: data.left,
            top: data.top - 15,
            index: index,
            type: 'text',
          });
          this.canvas.add(text);
    });
    this.canvas.renderAll();
  }

  subscribe() {
    this.subscribed = true;
    this.canvas.discardActiveObject().renderAll();
    this.__registerEvents();
    this.__setDrawing(true);
    this.__lockObjects(this.rectObjects, true);
    // this.__lockObjects(this.objects, true);
  }

  unsubscribe() {
    if (!this.subscribed) {
      return;
    }
    this.subscribed = false;
    this.canvas.discardActiveObject().renderAll();
    this.__removeEvents();
    this.__setDrawing(false);
    this.__lockObjects(this.rectObjects, false);
    // this.__lockObjects(this.objects, false);

    // Prints out all the objects after finish drawing
    console.log(this.canvas.getObjects());
  }

  /**
   * Set Drawing Status
   * @param {Boolean} value
   */
  __setDrawing(value) {
    this.drawing = value;
    return;
  }

  /**
   * Lock current active object
   * @param {Array<fabric.Object> | fabric.Object} objects
   * @param {Boolean} value
   */
  __lockObjects(object, value) {
    this.canvas.selection = !value;
    if (value){
      this.canvas.defaultCursor = 'pointer';
    }

    if (Array.isArray(object)) {
      object.forEach((fabricObject) => {
        fabricObject.set("lockMovementX", value);
        fabricObject.set("lockMovementY", value);
        fabricObject.evented = !value;
      });
      return;
    }
    object.set("lockMovementX", value);
    object.set("lockMovementY", value);
    object.evented = !value;
    // change cursor
    
  }

  setDrawingMode(type) {
    this.type = type;
  }

  __removeSelectedObjects() {
    this.activeObjects.forEach((object) => {
      this.canvas.fxRemove(object);
    });
  }

  __removeEvents() {
    this.canvas.off("mouse:move", this._onMouseMoveCallback);
    this.canvas.off("mouse:down", this._onMouseDownCallback);
    this.canvas.off("mouse:up", this._onMouseUpCallback);
  }

  __registerEvents() {
    // On mose move create start to draw Rect
    this.canvas.on("mouse:move", this._onMouseMoveCallback);
    this.canvas.on("mouse:down", this._onMouseDownCallback);
    this.canvas.on("mouse:up", this._onMouseUpCallback);
  }

  // MOuse move cb
  _onMouseMoveCallback(e) {}

  // mouse down cb
  _onMouseDownCallback(e) {}

  // mouse up cb
  _onMouseUpCallback(e) {}
}
