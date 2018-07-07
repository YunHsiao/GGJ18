export default class AddBoxPrefab extends cc.ScriptComponent {
  constructor() {
    super();
  }

  start() {
    this.btn.once('clicked', () => {
      let en = this.box.instantiate(null, null);
      en.setParent(this.parent);
      en.active = false;
      en.active = true;
    });
    // console.log('aaa');
  }

}

AddBoxPrefab.schema = {
  box: {
    type: 'asset',
    default: null
  },
  parent: {
    type: 'entity',
    default: null
  },
  btn: {
    type: 'entity',
    default: null
  },
};