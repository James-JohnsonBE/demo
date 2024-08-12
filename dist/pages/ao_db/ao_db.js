(()=>{var Gs=Object.freeze,Bs=Object.defineProperty;var O=(t,e)=>()=>(t&&(e=t(t=0)),e);var en=(t,e)=>{for(var s in e)Bs(t,s,{get:e[s],enumerable:!0})};var Ms=(t,e)=>Gs(Bs(t,"raw",{value:Gs(e||t.slice())}));var Be,ws,js,ot=O(()=>{Ee();Be=ko.observableArray(),ws=t=>ts.ACTIONOFFICE==t.Role,js=t=>ts.REQUESTINGOFFICE==t.Role});var rt,ss=O(()=>{rt=class{constructor(e,s,o){this.source=e,this.type=s,this.description=o}}});var at,Ws=O(()=>{at=class{constructor(e){e?.ID&&(this.ID=e.ID),e?.Title&&(this.Title=e.Title)}ObservableID=ko.observable();ObservableTitle=ko.observable();get id(){return this.ObservableID()}set id(e){this.ObservableID(e)}get Title(){return this.ObservableTitle()}set Title(e){this.ObservableTitle(e)}}});var Oe=O(()=>{ss();Ws();lt()});function on(t){return{requirement:ko.pureComputed(()=>{if(!ko.unwrap(t.isRequired))return!1;let s=ko.unwrap(t.Value);return s?.constructor==Array?!s.length:s==null}),error:new rt("text-field","required-field",`${ko.utils.unwrapObservable(t.displayName)} is required!`)}}var me,Js=O(()=>{ss();me=class{constructor({displayName:e,systemName:s,instructions:o=null,isRequired:u=!1,width:h,classList:w=[],Visible:N=ko.pureComputed(()=>!0)}){this.displayName=e,this.systemName=s,this.instructions=o,this.isRequired=u,this.Visible=N,this.width=h?"col-md-"+h:"col-md-6",this.classList=w,this.addFieldRequirement(on(this))}Value=ko.observable();get=()=>this.Value();set=e=>this.Value(e);clear=()=>{ko.isObservableArray(this.Value)?this.Value([]):this.Value(null)};toString=ko.pureComputed(()=>this.Value());toJSON=()=>this.Value();fromJSON=e=>this.Value(e);validate=(e=!0)=>(this.ShowErrors(e),this.Errors());_fieldValidationRequirements=ko.observableArray();Errors=ko.pureComputed(()=>this.Visible()?this._fieldValidationRequirements().filter(s=>s.requirement()).map(s=>s.error):[]);addFieldRequirement=e=>this._fieldValidationRequirements.push(e);IsValid=ko.pureComputed(()=>!this.Errors().length);ShowErrors=ko.observable(!1);ValidationClass=ko.pureComputed(()=>{if(this.ShowErrors())return this.Errors().length?"is-invalid":"is-valid"})}});function Re(t){ko.components.register(t.edit,{template:t.editTemplate,viewModel:t}),ko.components.register(t.view,{template:t.viewTemplate,viewModel:t})}var se,fe,Ue=O(()=>{se=String.raw;fe=class{constructor(e){Object.assign(this,e)}_id;getUniqueId=()=>(this._id||(this._id="field-"+Math.floor(Math.random()*1e4)),this._id);Errors=ko.pureComputed(()=>this.ShowErrors()?this.isRequired?this.Value()?[]:[new ValidationError("text-field","required-field",this.displayName+" is required!")]:[]:[]);ShowErrors=ko.observable(!1);ValidationClass=ko.pureComputed(()=>{if(this.ShowErrors())return this.Errors().length?"is-invalid":"is-valid"});static viewTemplate=se`
    <div class="fw-semibold" data-bind="text: displayName"></div>
    <div data-bind="text: toString()"></div>
  `;static editTemplate=se`<div>Uh oh!</div>`}});var rn,an,Pt,Ks=O(()=>{Ue();rn=se`
  <h5>
    <span data-bind="text: displayName"></span
    ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
  </h5>
  <!-- ko ifnot: entityType -->
  <div class="alert alert-danger">Missing entity type</div>
  <!-- /ko -->
  <!-- ko if: entityType -->
  <!-- ko ifnot: multiple -->
  <div
    data-bind="component: {name: Value()?.components.edit, params: {Entity: Value()}}"
  ></div>
  <!-- /ko -->
  <!-- ko if: multiple -->
  <table class="table">
    <thead>
      <tr data-bind="">
        <!-- ko foreach: Cols -->
        <th data-bind="text: displayName"></th>
        <!-- /ko -->
        <th>Actions</th>
      </tr>
    </thead>
    <tbody data-bind="">
      <!-- ko foreach: {data: Value, as: 'row'} -->
      <tr data-bind="">
        <!-- ko foreach: {data: row.FormFields, as: 'col'} -->
        <td data-bind="text: col.toString"></td>
        <!-- /ko -->
        <td>
          <i
            title="remove item"
            class="fa-solid fa-trash pointer"
            data-bind="click: $parent.remove.bind(row)"
          ></i>
        </td>
      </tr>
      <!-- /ko -->
      <tr>
        <!-- ko foreach: NewItem()?.FormFields -->
        <td>
          <div
            data-bind="component: {name: components.edit, params: $data}"
          ></div>
        </td>
        <!-- /ko -->
        <td class="align-bottom">
          <button
            title="add and new"
            type="button"
            data-bind="click: submit"
            class="btn btn-success"
          >
            Add +
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  <!-- /ko -->
  <!-- /ko -->
`,an=se`
  <h5>
    <span data-bind="text: displayName"></span
    ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
  </h5>
  <!-- ko ifnot: entityType -->
  <div class="alert alert-danger">Missing entity type</div>
  <!-- /ko -->
  <!-- ko if: entityType -->
  <!-- ko ifnot: multiple -->
  <!-- ko if: Value -->
  <div
    data-bind="component: {name: Value().components.view, params: {Entity: Value()}}"
  ></div>
  <!-- /ko -->
  <!-- /ko -->
  <!-- ko if: multiple -->
  <table class="table">
    <thead>
      <tr data-bind="">
        <!-- ko foreach: Cols -->
        <th data-bind="text: displayName"></th>
        <!-- /ko -->
      </tr>
    </thead>
    <tbody data-bind="">
      <!-- ko foreach: {data: Value, as: 'row'} -->
      <tr data-bind="">
        <!-- ko foreach: {data: row.FormFields, as: 'col'} -->
        <td data-bind="text: col.toString()"></td>
        <!-- /ko -->
      </tr>
      <!-- /ko -->
    </tbody>
  </table>
  <!-- /ko -->
  <!-- /ko -->
`,Pt=class extends fe{constructor(e){super(e)}static viewTemplate=an;static editTemplate=rn;static view="blob-view";static edit="blob-edit";static new="blob-edit"};Re(Pt)});var ln,un,_t,zs=O(()=>{Ue();ln=se`
  <div class="form-check form-switch">
    <label class="form-check-label"
      ><span class="fw-semibold" data-bind="text: displayName"></span>
      <input
        class="form-check-input"
        type="checkbox"
        role="switch"
        data-bind="checked: Value"
      />
      <!-- ko if: instructions -->
      <div
        class="fw-lighter fst-italic text-secondary"
        data-bind="html: instructions"
      ></div>
      <!-- /ko -->
    </label>
  </div>
`,un=se`
  <div class="form-check form-switch">
    <label class="form-check-label"
      ><span class="fw-semibold" data-bind="text: displayName"></span>
      <input
        class="form-check-input"
        type="checkbox"
        role="switch"
        data-bind="checked: Value"
        disabled
      />
    </label>
  </div>
`,_t=class extends fe{constructor(e){super(e)}static viewTemplate=un;static editTemplate=ln;static view="checkbox-view";static edit="checkbox-edit";static new="checkbox-edit"};Re(_t)});var cn,Nt,Ys=O(()=>{Ue();cn=se`
  <label class="fw-semibold"
    ><span data-bind="text: displayName"></span
    ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
    <input
      class="form-control"
      data-bind="value: inputBinding, class: ValidationClass, attr: {'type': type}"
    />
    <!-- ko if: instructions -->
    <div
      class="fw-lighter fst-italic text-secondary"
      data-bind="html: instructions"
    ></div>
    <!-- /ko -->
  </label>
  <!-- ko if: ShowErrors -->
  <!-- ko foreach: Errors -->
  <div class="fw-semibold text-danger" data-bind="text: description"></div>
  <!-- /ko -->
  <!-- /ko -->
`,Nt=class extends fe{constructor(e){super(e)}static editTemplate=cn;static view="date-view";static edit="date-edit";static new="date-edit"};Re(Nt)});var dn,Et,Xs=O(()=>{Ue();dn=se`
  <label class="fw-semibold"
    ><span data-bind="text: displayName"></span
    ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
    <!-- ko if: isSearch -->
    <div data-bind="text: toString()"></div>
    <input class="form-control" data-bind="" />
    <!-- /ko -->
    <!-- ko ifnot: isSearch -->
    <!-- ko if: Options().length -->
    <!-- ko if: multiple -->
    <select
      class="form-select"
      name=""
      id=""
      multiple="true"
      data-bind="options: Options, 
  selectedOptions: Value,
  optionsText: optionsText,
  class: ValidationClass"
    ></select>
    <div class="fw-light flex justify-between">
      <p class="fst-italic">Hold ctrl to select multiple</p>
      <button type="button" class="btn btn-link h-1" data-bind="click: clear">
        CLEAR
      </button>
    </div>
    <!-- /ko -->
    <!-- ko ifnot: multiple -->
    <select
      class="form-select"
      name=""
      id=""
      data-bind="options: Options, 
    optionsCaption: 'Select...', 
    value: Value,
    optionsText: optionsText,
    class: ValidationClass"
    ></select>
    <!-- /ko -->
    <!-- /ko -->
    <!-- /ko -->
    <!-- ko if: instructions -->
    <div
      class="fw-lighter fst-italic text-secondary"
      data-bind="html: instructions"
    ></div>
    <!-- /ko -->
  </label>
  <!-- ko if: ShowErrors -->
  <!-- ko foreach: Errors -->
  <div class="fw-semibold text-danger" data-bind="text: description"></div>
  <!-- /ko -->
  <!-- /ko -->
`,Et=class extends fe{constructor(e){super(e),this.onSearchInput=e.onSearchInput,this.multiple=e.multiple??!1}static editTemplate=dn;static view="lookup-view";static edit="lookup-edit";static new="lookup-edit"};Re(Et)});var pn,mn,Ot,bs=O(()=>{Ue();pn=se`
  <label class="fw-semibold w-100"
    ><span data-bind="text: displayName"></span
    ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
    <!-- ko ifnot: spGroupId -->
    <div
      data-bind="attr: {id: getUniqueId()}, 
      people: Value, 
      pickerOptions: pickerOptions,
      class: ValidationClass"
    ></div>
    <!-- /ko -->
    <!-- ko if: ShowUserSelect -->
    <select
      class="form-select"
      name=""
      id=""
      data-bind="options: userOpts, 
        optionsCaption: 'Select...', 
        optionsText: 'Title',
        value: ValueFunc,
        class: ValidationClass"
    ></select>
    <!-- /ko -->
    <!-- ko if: instructions -->
    <div
      class="fw-lighter fst-italic text-secondary"
      data-bind="html: instructions"
    ></div>
    <!-- /ko -->
  </label>
  <!-- ko if: ShowErrors -->
  <!-- ko foreach: Errors -->
  <div class="fw-semibold text-danger" data-bind="text: description"></div>
  <!-- /ko -->
  <!-- /ko -->
`,mn=se`
  <div class="fw-semibold" data-bind="text: displayName"></div>
  <!-- ko if: toString -->
  <!-- ko ifnot: multiple -->
  <div
    data-bind="text: toString, 
      attr: {title: Value()?.LoginName}"
  ></div>
  <!-- /ko -->
  <!-- ko if: multiple -->
  <ul data-bind="foreach: Value">
    <li data-bind="attr: {title: LoginName}, text: Title"></li>
  </ul>
  <!-- /ko -->
  <!-- /ko -->
  <!-- ko ifnot: toString -->
  <div class="fst-italic">Not provided.</div>
  <!-- /ko -->
`,Ot=class extends fe{constructor(e){super(e)}ValueFunc=ko.pureComputed({read:()=>this.Value()?ko.unwrap(this.userOpts).find(s=>s.ID==this.Value().ID):void 0,write:e=>{ko.unwrap(this.userOpts)&&this.Value(e)}});ShowUserSelect=ko.pureComputed(()=>this.spGroupName?ko.unwrap(this.userOpts).length:!1);static viewTemplate=mn;static editTemplate=pn;static view="people-view";static edit="people-edit";static new="people-edit"};Re(Ot)});var fn,Xe,Zs=O(()=>{Ue();fn=se`
  <label class="fw-semibold"
    ><span data-bind="text: displayName"></span
    ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
  </label>
  <search-select
    class="form-select"
    data-bind="searchSelect: { 
      options: Options, 
      selectedOptions: Value,
      optionsText: optionsText,
      onSearchInput: onSearchInput
    }"
  >
  </search-select>
  <div class="fw-light flex justify-between">
    <p class="fst-italic"></p>
    <button type="button" class="btn btn-link h-1" data-bind="click: clear">
      CLEAR
    </button>
  </div>
  <!-- ko if: instructions -->
  <div
    class="fw-lighter fst-italic text-secondary"
    data-bind="html: instructions"
  ></div>
  <!-- /ko -->
  <!-- ko if: ShowErrors -->
  <!-- ko foreach: Errors -->
  <div class="fw-semibold text-danger" data-bind="text: description"></div>
  <!-- /ko -->
  <!-- /ko -->
`,Xe=class extends fe{constructor(e){super(e),this.Options=e.Options,this.Value=e.Value,this.optionsText=e.optionsText??(s=>s),this.multiple=e.multiple,this.OptionsCaption=e.OptionsCaption??"Select...",this.onSearchInput=e.onSearchInput}GetSelectedOptions=ko.pureComputed(()=>this.multiple?this.Value():this.Value()?[this.Value()]:[]);InputGroupFocused=ko.observable();setFocus=()=>this.InputGroupFocused(!0);FilterText=ko.observable();FilteredOptions=ko.pureComputed(()=>this.Options().filter(e=>this.GetSelectedOptions().indexOf(e)>=0?!1:this.FilterText()?this.optionsText(e).toLowerCase().includes(this.FilterText().toLowerCase()):!0));addSelection=(e,s)=>{console.log("selected",e),s.target.nextElementSibling&&s.target.nextElementSibling.focus(),this.multiple?this.Value.push(e):this.Value(e)};removeSelection=e=>this.multiple?this.Value.remove(e):this.Value(null);setInputGroupFocus=()=>{this.InputGroupFocused(!0),clearTimeout(this.focusOutTimeout)};removeInputGroupFocus=(e,s)=>{this.focusOutTimeout=window.setTimeout(()=>{this.InputGroupFocused(!1)},0)};static editTemplate=fn;static view="search-select-view";static edit="search-select-edit";static new="search-select-new"};Re(Xe)});var gn,Ut,ei=O(()=>{Ue();gn=se`
  <label class="fw-semibold"
    ><span data-bind="text: displayName"></span
    ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
    <!-- ko if: multiple -->
    <select
      class="form-select"
      name=""
      id=""
      multiple="true"
      data-bind="options: Options, 
        optionsCaption: 'Select...', 
        optionsText: optionsText,
        selectedOptions: Value,
        class: ValidationClass"
    ></select>
    <div class="fst-italic fw-light">Hold ctrl to select multiple.</div>
    <!-- /ko -->
    <!-- ko ifnot: multiple -->
    <select
      class="form-select"
      name=""
      id=""
      data-bind="options: Options, 
        optionsCaption: 'Select...', 
        optionsText: optionsText,
        value: Value,
        class: ValidationClass"
    ></select>
    <!-- /ko -->
    <!-- ko if: instructions -->
    <div
      class="fw-lighter fst-italic text-secondary"
      data-bind="html: instructions"
    ></div>
    <!-- /ko -->
  </label>
  <!-- ko if: ShowErrors -->
  <!-- ko foreach: Errors -->
  <div class="fw-semibold text-danger" data-bind="text: description"></div>
  <!-- /ko -->
  <!-- /ko -->
`,Ut=class extends fe{constructor(e){super(e)}static editTemplate=gn;static view="select-view";static edit="select-edit";static new="select-edit"};Re(Ut)});var hn,Rn,qt,ti=O(()=>{Ue();hn=se`
  <div class="component field">
    <!-- ko if: isRichText -->
    <label class="fw-semibold"
      ><span data-bind="text: displayName"></span
      ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span
      >:</label
    >
    <!-- ko if: instructions -->
    <div
      class="fw-lighter fst-italic text-secondary"
      data-bind="html: instructions"
    ></div>
    <!-- /ko -->
    <div
      class="richtext-field"
      data-bind="childrenComplete: childrenHaveLoaded"
    >
      <!-- Create the editor container -->
      <div
        class="form-control"
        data-bind="attr: {'id': getUniqueId()}, class: ValidationClass"
        style="height: 150px"
      >
        <div data-bind="html: Value"></div>
      </div>
    </div>
    <!-- /ko -->
    <!-- ko ifnot: isRichText -->
    <label class="fw-semibold"
      ><span data-bind="text: displayName"></span
      ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
      <!-- ko if: instructions -->
      <div
        class="fw-lighter fst-italic text-secondary"
        data-bind="html: instructions"
      ></div>
      <!-- /ko -->
      <textarea
        name=""
        id=""
        cols="30"
        rows="10"
        class="form-control"
        data-bind="textInput: Value, class: ValidationClass, attr: attr"
      ></textarea>
    </label>
    <!-- /ko -->
    <!-- ko if: ShowErrors -->
    <!-- ko foreach: Errors -->
    <div class="fw-semibold text-danger" data-bind="text: description"></div>
    <!-- /ko -->
    <!-- /ko -->
  </div>
`,Rn=se`
  <div class="fw-semibold" data-bind="text: displayName"></div>
  <!-- ko if: Value -->
  <!-- ko if: isRichText -->
  <div data-bind="html: Value"></div>
  <!-- /ko -->
  <!-- ko ifnot: isRichText -->
  <div data-bind="text: Value"></div>
  <!-- /ko -->
  <!-- /ko -->
  <!-- ko ifnot: Value -->
  <div class="fst-italic">Not provided.</div>
  <!-- /ko -->
`,qt=class extends fe{constructor(e){super(e)}childrenHaveLoaded=e=>{this.initializeEditor()};getToolbarId=()=>"toolbar-"+this.getUniqueId();initializeEditor(){let e=[["bold","italic","underline","strike"],["link"],["blockquote","code-block"],[{header:1},{header:2}],[{list:"ordered"},{list:"bullet"}],[{script:"sub"},{script:"super"}],[{indent:"-1"},{indent:"+1"}],[{direction:"rtl"}],[{size:["small",!1,"large","huge"]}],[{header:[1,2,3,4,5,6,!1]}],[{color:[]},{background:[]}],[{font:[]}],[{align:[]}],["clean"]];var s=new Quill("#"+this.getUniqueId(),{modules:{toolbar:e},theme:"snow"});let o=this.Value;o.subscribe(u=>{u==""&&s.setText("")}),s.on("text-change",function(u,h,w){o(s.root.textContent?s.root.innerHTML:"")})}static viewTemplate=Rn;static editTemplate=hn;static view="text-area-view";static edit="text-area-edit";static new="text-area-edit"};Re(qt)});var vn,Lt,si=O(()=>{Ue();vn=se`
  <label class="fw-semibold"
    ><span data-bind="text: displayName"></span
    ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
    <input
      class="form-control"
      data-bind="textInput: Value, class: ValidationClass, attr: attr"
    />
    <!-- ko if: instructions -->
    <div
      class="fw-lighter fst-italic text-secondary"
      data-bind="html: instructions"
    ></div>
    <!-- /ko -->
  </label>
  <!-- ko if: ShowErrors -->
  <!-- ko foreach: Errors -->
  <div class="fw-semibold text-danger" data-bind="text: description"></div>
  <!-- /ko -->
  <!-- /ko -->
`,Lt=class extends fe{constructor(e){super(e)}static editTemplate=vn;static view="text-view";static edit="text-edit";static new="text-edit"};Re(Lt)});var je=O(()=>{Ue();Ks();zs();Ys();Xs();bs();Zs();ei();ti();si()});var Ze,ii=O(()=>{ye();je();Ze=class t extends me{constructor(e){super(e),this.entityType=e.entityType,this.multiple=e.multiple,this.multiple&&(this.Value=ko.observableArray()),ko.isObservable(this.entityType)&&this.entityType.subscribe(this.updateEntityTypeHandler),this.updateEntityTypeHandler(ko.unwrap(this.entityType))}toString=ko.pureComputed(()=>`${this.Value()?.length??"0"} items`);toJSON=ko.pureComputed(()=>this.multiple?this.Value().map(e=>e.toJSON()):this.Value()?.toJSON());fromJSON=e=>{if(e){if(!this.multiple){this.Value()?.fromJSON(e);return}this.Value.removeAll(),e.map(s=>{let o=new this.entityConstructor;o.fromJSON(s),this.Value.push(o)})}};get=()=>JSON.stringify(this.toJSON());blob;set=e=>{window.DEBUG&&console.log(e),this.blob=e,e?.constructor!=t&&this.fromJSON(JSON.parse(e))};get entityConstructor(){return ko.utils.unwrapObservable(this.entityType)}Cols=ko.pureComputed(()=>ko.unwrap(this.entityType)?new this.entityConstructor().FormFields():[]);NewItem=ko.observable();submit=()=>{(this.NewItem()?.validate()).length||(this.Value.push(this.NewItem()),this.NewItem(new this.entityConstructor))};add=e=>this.Value.push(e);remove=e=>this.Value.remove(e);updateEntityTypeHandler=e=>{e&&(this.multiple?this.NewItem(new this.entityConstructor):this.Value(new this.entityConstructor),this.blob&&this.fromJSON(JSON.parse(this.blob)))};applyValueToTypedValues=()=>{};components=Pt}});var Vt,ni=O(()=>{ye();je();Vt=class extends me{constructor(e){super(e)}components=_t}});var we,Ae,oi=O(()=>{je();ye();we={date:"date",datetime:"datetime-local"},Ae=class extends me{constructor(e){super(e),this.type=e.type??we.date}toString=ko.pureComputed(()=>{switch(this.type){case we.date:return this.toLocaleDateString();case we.datetime:return this.toLocaleString();default:return""}});toSortableDateString=()=>this.Value()?.format("yyyy-MM-dd");toLocaleDateString=()=>this.Value()?.toLocaleDateString();toLocaleString=()=>this.Value()?.toLocaleString();toInputDateString=()=>{let e=this.Value();return[e.getUTCFullYear().toString().padStart(4,"0"),(e.getUTCMonth()+1).toString().padStart(2,"0"),e.getUTCDate().toString().padStart(2,"0")].join("-")};toInputDateTimeString=()=>this.Value().format("yyyy-MM-ddThh:mm");get=ko.pureComputed(()=>!this.Value()||isNaN(this.Value().valueOf())?null:this.Value().toISOString());set=e=>{if(!e)return null;e.constructor.getName()!="Date"&&(e=new Date(e)),e.getTimezoneOffset(),this.Value(e)};inputBinding=ko.pureComputed({read:()=>{if(!this.Value())return null;switch(this.type){case we.date:return this.toInputDateString();case we.datetime:return this.toInputDateTimeString();default:return null}},write:e=>{e&&this.Value(new Date(e))}});components=Nt}});function ri(t,e){if(t.FieldMap&&t.FieldMap[e]){let s=t.FieldMap[e];return typeof s=="function"?s():s.toString&&typeof s.toString=="function"?s.toString():s.get&&typeof s.get=="function"?s.get():s.obs?s.obs():s}return t[e]??""}var be,ai=O(()=>{je();ye();be=class extends me{constructor({displayName:e,type:s,isRequired:o=!1,Visible:u,entitySet:h,options:w=ko.observableArray(),optionsFilter:N=null,optionsText:P=null,multiple:U=!1,lookupCol:B=null,instructions:j}){super({Visible:u,displayName:e,isRequired:o,instructions:j}),w?(this.isSearch=!1,this.allOpts=w):this.isSearch=!0,this.isSearch=!w,this.multiple=U,this.Value=U?ko.observableArray():ko.observable(),this.entityType=s,this.entitySet=h,this.lookupCol=B??"Title",this.optionsText=P??(ee=>ee[this.lookupCol]),N&&(this.optionsFilter=N),this.components=U?Xe:Et}isSearch=!1;allOpts;optionsFilter=e=>e;Options=ko.pureComputed(()=>{let e=ko.unwrap(this.optionsFilter);return ko.unwrap(this.allOpts).filter(e)});IsLoading=ko.observable(!1);HasLoaded=ko.observable(!1);refresh=async()=>{if(this.Value()){if(this.IsLoading(!0),!this.multiple){await this.entitySet.LoadEntity(this.Value()),this.IsLoading(!1),this.HasLoaded(!0);return}await Promise.all(this.Value().map(async e=>await this.entitySet.LoadEntity(e))),this.IsLoading(!1),this.HasLoaded(!0)}};ensure=async()=>{if(!this.HasLoaded()){if(this.IsLoading())return new Promise((e,s)=>{let o=this.IsLoading.subscribe(u=>{u||(o.dispose(),e())})});await this.refresh()}};toString=ko.pureComputed(()=>this.Value()?this.multiple?this.Value().map(e=>ri(e,this.lookupCol)).join(", "):ri(this.Value(),this.lookupCol):"");get=()=>{if(!this.Value())return;if(this.multiple)return this.Value().map(s=>({ID:s.ID,LookupValue:s.LookupValue,Title:s.Title}));let e=this.Value();return{ID:e.ID,LookupValue:e.LookupValue,Title:e.Title}};set=e=>{if(!e){this.Value(e);return}if(this.multiple){let s=Array.isArray(e)?e:e.results??e.split("#;");this.Value(s.map(o=>this.findOrCreateNewEntity(o)));return}this.Value(this.findOrCreateNewEntity(e)),e&&this.toString()};findOrCreateNewEntity=e=>{if(this.entityType.FindInStore){let u=this.entityType.FindInStore(e);if(u)return u;console.warn(`Could not find entity in store: ${this.entityType.name}`,e)}let s=this.allOpts().find(u=>u.ID==e.ID);if(s)return s;if(this.entityType.Create)return this.entityType.Create(e);let o=new this.entityType;return o.ID=e.ID,this.entitySet.LoadEntity(o),o}}});var li,ui=O(()=>{li=(t,e)=>t.Title>e.Title?1:t.Title<e.Title?-1:0});var Pe,Ss=O(()=>{Pe=class t{constructor({ID:e,Title:s,LoginName:o=null,IsGroup:u=null,IsEnsured:h=!1}){this.ID=e,this.Title=s,this.LookupValue=s,this.LoginName=o!=""?o:null,this.IsGroup=u,this.IsEnsured=h}ID=null;Title=null;LoginName=null;LookupValue=null;getKey=()=>this.LoginName??this.Title;static Create=function(e){return!e||!e.ID&&!(e.Title||e.LookupValue)?null:new t({...e,Title:e.Title??e.LookupValue})}}});var is,ci=O(()=>{Oe();is=class extends at{constructor(e){super(e)}static Views={All:["ID","Title","Created","Author","Modified","Editor"]};static ListDef={name:"Pages",title:"Pages"}}});var et=O(()=>{Ss();ci()});var ns,di=O(()=>{ns="/sites/CGFS/Style Library/apps/audit/src"});var yn,wn,Cs=O(()=>{et();Ie();di();ko.subscribable.fn.subscribeChanged=function(t){var e;this.subscribe(function(s){e=s},this,"beforeChange"),this.subscribe(function(s){t(s,e)})};ko.observableArray.fn.subscribeAdded=function(t){this.subscribe(function(e){let s=e.filter(o=>o.status=="added").map(o=>o.value);t(s)},this,"arrayChange")};ko.bindingHandlers.searchSelect={init:function(t,e,s){let{options:o,selectedOptions:u,optionsText:h,onSearchInput:w}=e();function N(){let U=ko.unwrap(o).map(B=>{let j=document.createElement("option");return ko.selectExtensions.writeValue(j,ko.unwrap(B)),j.innerText=h(B),ko.unwrap(u)?.find(ee=>ee.ID==B.ID)&&j.setAttribute("selected",""),j});t.append(...U)}N(),ko.isObservable(o)&&o.subscribe(()=>N(),this),ko.utils.registerEventHandler(t,"change",P=>{u(t.selectedOptions.map(U=>ko.selectExtensions.readValue(U)))}),w&&ko.utils.registerEventHandler(t,"input",P=>{w(P.originalEvent.target.searchInputElement.value)})},update:function(t,e,s,o,u){let{selectedOptions:h}=e(),w=ko.unwrap(h);for(var N=0;N<t.options.length;N++){let P=t.options[N];P.toggleAttribute("selected",w.includes(ko.selectExtensions.readValue(P)))}}};ko.bindingHandlers.people={init:function(t,e,s){var o={};o.PrincipalAccountType="User",o.SearchPrincipalSource=15,o.ShowUserPresence=!0,o.ResolvePrincipalSource=15,o.AllowEmailAddresses=!0,o.AllowMultipleValues=!1,o.MaximumEntitySuggestions=50,o.OnUserResolvedClientScript=async function(u,h){var w=SPClientPeoplePicker.SPClientPeoplePickerDict[u],N=e(),P=w.GetControlValueAsJSObject()[0];if(!P){N(null);return}if(P.IsResolved){if(P.Key==N()?.LoginName)return;var U=await ut(P.Key),B=new Pe(U);N(B)}},SPClientPeoplePicker_InitStandaloneControlWrapper(t.id,null,o)},update:function(t,e,s,o,u){var h=SPClientPeoplePicker.SPClientPeoplePickerDict[t.id+"_TopSpan"],w=ko.utils.unwrapObservable(e());if(!w){h?.DeleteProcessedUser();return}w&&!h.GetAllUserInfo().find(N=>N.DisplayText==w.LookupValue)&&h.AddUserKeys(w.LoginName??w.LookupValue??w.Title)}};ko.bindingHandlers.dateField={init:function(t,e,s){},update:function(t,e,s,o,u){}};ko.bindingHandlers.downloadLink={update:function(t,e,s,o,u){var h=e(),w=h.replace(/:([A-Za-z_]+)/g,function(N,P){return ko.unwrap(o[P])});t.href=w}};ko.bindingHandlers.files={init:function(t,e){function s(u){var h=e();if(!u.length){h.removeAll();return}let w=ko.unwrap(h),N=[];for(let P of u)w.find(U=>U.name==P.name)||N.push(P);ko.utils.arrayPushAll(h,N)}ko.utils.registerEventHandler(t,"change",function(){s(t.files)});let o=t.closest("label");o&&(ko.utils.registerEventHandler(o,"dragover",function(u){u.preventDefault(),u.stopPropagation()}),ko.utils.registerEventHandler(o,"dragenter",function(u){u.preventDefault(),u.stopPropagation(),o.classList.add("dragging")}),ko.utils.registerEventHandler(o,"dragleave",function(u){u.preventDefault(),u.stopPropagation(),o.classList.remove("dragging")}),ko.utils.registerEventHandler(o,"drop",function(u){u.preventDefault(),u.stopPropagation();let w=u.originalEvent.dataTransfer.files;s(w)}))},update:function(t,e,s,o,u){if(!e()().length&&t.files.length){t.value=null;return}}};ko.bindingHandlers.toggleClick={init:function(t,e,s){var o=e();ko.utils.registerEventHandler(t,"click",function(){var u=s.get("toggleClass"),h=s.get("classContainer"),w=s.get("containerType");if(w&&w=="sibling")$(t).nextUntil(h).each(function(){$(this).toggleClass(u)});else if(w&&w=="doc"){var N=$(t).attr("src");N=="/_layouts/images/minus.gif"?$(t).attr("src","/_layouts/images/plus.gif"):$(t).attr("src","/_layouts/images/minus.gif"),$(t).parent()&&$(t).parent().parent()&&$(t).parent().parent().nextUntil(h).each(function(){$(this).toggleClass(u)})}else w&&w=="any"?$("."+u).is(":visible")?$("."+u).hide():$("."+u).show():$(t).find(h).toggleClass(u)})}};ko.bindingHandlers.toggles={init:function(t,e){var s=e();ko.utils.registerEventHandler(t,"click",function(){s(!s())})}};yn={loadTemplate:function(t,e,s){e.fromPath?fetch(ns+e.fromPath).then(o=>{if(!o.ok)throw new Error(`Error Fetching HTML Template - ${o.statusText}`);return o.text()}).catch(o=>{e.fallback&&(console.warn("Primary template not found, attempting fallback",e),fetch(ns+e.fallback).then(u=>{if(!u.ok)throw new Error(`Error Fetching fallback HTML Template - ${u.statusText}`);return u.text()}).then(u=>ko.components.defaultLoader.loadTemplate(t,u,s)))}).then(o=>o?ko.components.defaultLoader.loadTemplate(t,o,s):null):s(null)}};ko.components.loaders.unshift(yn);wn={loadViewModel:function(t,e,s){if(e.viaLoader){let o=import(ns+e.viaLoader).then(u=>{let h=u.default;ko.components.defaultLoader.loadViewModel(t,h,s)})}else s(null)}};ko.components.loaders.unshift(wn)});function rs(t,{template:e,viewModel:s=null}){ko.components.register(t,{template:e,viewModel:s})}var os,pi=O(()=>{os=String.raw});function fi(t){return new Promise((e,s)=>t.executeQueryAsync(e,(o,u)=>{s({sender:o,args:u})}))}function Gt(t,e=null){return{ID:t.get_id(),Title:t.get_title(),LoginName:t.get_loginName(),IsEnsured:!0,IsGroup:e??t.constructor.getName()=="SP.Group",oPrincipal:t}}function hi(){let t=X.globalConfig.defaultGroups,e={};return Object.keys(t).forEach(s=>{e[s]=Gt(t[s],!0)}),e}async function Ri(t){if(As[t]?.Users?.constructor==Array)return As[t].Users;let e=`/web/sitegroups/GetByName('${t}')?$expand=Users`,o=(await ve(e)).d;return o.Users=o.Users?.results,As[t]=o,o.Users}async function vi(t=_spPageContextInfo.userId){let e="/sp.userprofiles.peoplemanager/getmyproperties",s=`/Web/GetUserById(${t})/?$expand=Groups`,o=(await ve(s)).d,u=(await ve(e))?.d.UserProfileProperties.results;function h(w,N){return w.find(P=>P.Key==N)?.Value}return{ID:t,Title:o.Title,LoginName:o.LoginName,WorkPhone:h(u,"WorkPhone"),EMail:h(u,"WorkEmail"),IsEnsured:!0,IsGroup:!1,Groups:o.Groups?.results?.map(w=>({...w,ID:w.Id,IsGroup:!0,IsEnsured:!0}))}}async function yi(t,e){let s=`/web/getfilebyserverrelativeurl('${t}')/copyto('${e}')`;return await ve(s,"POST")}async function ut(t){return new Promise((e,s)=>{var o=X.globalConfig.siteGroups.find(function(U){return U.LoginName==t});if(o){e(o);return}var u=new SP.ClientContext.get_current,h=u.get_web().ensureUser(t);function w(U,B){let j=Gt(h);e(j)}function N(U,B){console.error("Failed to ensure user :"+B.get_message()+`
`+B.get_stackTrace()),s(B)}let P={oUser:h,resolve:e,reject:s};u.load(h),u.executeQueryAsync(Function.createDelegate(P,w),Function.createDelegate(P,N))})}function gi(t){var e=null;return this.globalConfig.siteGroups!=null&&(e=this.globalConfig.siteGroups.find(function(s){return s.Title==t})),e}function wi(t){var e=this;e.config={def:t};async function s(){if(!e.config.fieldSchema){let a=`/web/lists/GetByTitle('${e.config.def.title}')?$expand=Fields`,c=await ve(a);e.config.guid=c.d.Id,e.config.fieldSchema=c.d.Fields.results}}s();async function o(a,c){let v=new SP.ClientContext.get_current().get_web().get_lists().getByTitle(e.config.def.title);return st(v,a,c)}function u(a,c,p){p=p===void 0?!1:p;var m=new Array,v=new Array,b=new SP.ClientContext.get_current,C=b.get_web(),g=C.get_lists().getByTitle(e.config.def.title);a.forEach(function(A){var k=gi(A[0]);k?v.push([k,A[1]]):m.push([b.get_web().ensureUser(A[0]),A[1]])});function F(){console.log("Successfully found item");var A=new SP.ClientContext.get_current,k=A.get_web();p?(g.resetRoleInheritance(),g.breakRoleInheritance(!1,!1),g.get_roleAssignments().getByPrincipal(X.globalConfig.currentUser).deleteObject()):g.breakRoleInheritance(!1,!1),this.resolvedGroups.forEach(function(y){var D=SP.RoleDefinitionBindingCollection.newObject(A);D.add(k.get_roleDefinitions().getByName(y[1])),g.get_roleAssignments().add(y[0],D)}),this.users.forEach(function(y){var D=SP.RoleDefinitionBindingCollection.newObject(A);D.add(k.get_roleDefinitions().getByName(y[1])),g.get_roleAssignments().add(y[0],D)});var n={oList:g,callback:c};function r(){console.log("Successfully set permissions"),c(g)}function d(y,D){console.error("Failed to update permissions on List: "+this.oList.get_title()+D.get_message()+`
`,D.get_stackTrace())}A.load(g),A.executeQueryAsync(Function.createDelegate(n,r),Function.createDelegate(n,d))}function T(A,k){console.error("Failed to find List: "+this.oList.get_title+k.get_message(),k.get_stackTrace())}var S={oList:g,users:m,resolvedGroups:v,callback:c};b.load(g),m.map(function(A){b.load(A[0])}),b.executeQueryAsync(Function.createDelegate(S,F),Function.createDelegate(S,T))}function h(a){return a&&(Array.isArray(a)?a.map(c=>w(c)).join(";#"):w(a))}function w(a){return a.ID?`${a.ID};#${a.LookupValue??""}`:a.LookupValue?a.LookupValue:a.constructor.getName()=="Date"?a.toISOString():a}function N(a,c=null){return new Promise((p,m)=>{let v=new SP.ClientContext.get_current,C=v.get_web().get_lists().getByTitle(e.config.def.title),g=new SP.ListItemCreationInformation;if(c){var F=X.globalConfig.siteUrl+"/Lists/"+e.config.def.name+"/"+c;g.set_folderUrl(F)}let T=C.addItem(g),S=["ID","Author","Created","Editor","Modified"];Object.keys(a).filter(r=>!S.includes(r)).forEach(r=>{T.set_item(r,h(a[r]))}),T.update();function A(){p(T.get_id())}function k(r,d){console.error("Create Item Failed - List: "+e.config.def.name),console.error("ValuePairs",a),console.error(r,d),m(r)}let n={entity:a,oListItem:T,resolve:p,reject:m};v.load(T),v.executeQueryAsync(Function.createDelegate(n,A),Function.createDelegate(n,k))})}function P(a){if(!a)return a;let c={};switch(a.constructor.getName()){case"SP.FieldUserValue":c.LoginName=a.get_email();case"SP.FieldLookupValue":c.ID=a.get_lookupId(),c.LookupValue=a.get_lookupValue(),c.Title=a.get_lookupValue();break;default:c=a}return c}function U(a,c,p){var m=new SP.CamlQuery.createAllItemsQuery;m.set_viewXml(a);var v=new SP.ClientContext.get_current,b=v.get_web(),C=b.get_lists().getByTitle(e.config.def.title),g=C.getItems(m);function F(){var A=this,k=A.collListItem.getEnumerator();let n=[];for(;k.moveNext();){var r=k.get_current(),d={};c.forEach(y=>{var D=r.get_item(y);d[y]=Array.isArray(D)?D.map(E=>P(E)):P(D)}),n.push(d)}p(n)}function T(A,k){console.log("unsuccessful read",A),alert("Request on list "+e.config.def.name+` failed, producing the following error: 
 `+k.get_message()+`
StackTrack: 
 `+k.get_stackTrace())}var S={collListItem:g,callback:p,fields:c,camlQuery:m};v.load(g,`Include(${c.join(", ")})`),v.executeQueryAsync(Function.createDelegate(S,F),Function.createDelegate(S,T))}function B({fields:a=null,caml:c=null}){if(!c)var c='<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="FSObjType"/><Value Type="int">0</Value></Eq></Where></Query></View>';return new Promise((p,m)=>{U(c,a,p)})}function j(a,c){return new Promise((p,m)=>{try{de(a,c,p)}catch(v){m(v)}})}async function ee(a,c){let[p,m]=await ie(c),v=`/web/lists/GetByTitle('${e.config.def.title}')/items(${a})?$Select=${p}&$expand=${m}`;return(await ve(v)).d}async function ae(){if(!e.config.fieldSchema){let a=`/web/lists/GetByTitle('${e.config.def.title}')/Fields`,c=await ve(a);e.config.fieldSchema=c.d.results}return e.config.fieldSchema}async function ie(a){let c=[],p=[],m=await ae();return a.map(v=>{if(v=="FileRef"){c.push(v);return}if(v.includes("/")){c.push(v),p.push(v.split("/")[0]);return}let b=m.find(F=>F.StaticName==v);if(!b){alert(`Field '${v}' not found on list ${e.config.def.name}`);return}let C=v+"/ID",g=v+"/Title";switch(b.TypeAsString){case"LookupMulti":case"Lookup":g=v+"/"+b.LookupField;case"User":c.push(C),c.push(g),p.push(v);break;case"Choice":default:c.push(v)}}),[c,p]}async function le(a,{orderByColumn:c=null,sortAsc:p},{count:m=null,includePermissions:v=!1,includeFolders:b=!1},C){let[g,F]=await ie(C);v&&(g.push("RoleAssignments"),g.push("HasUniqueRoleAssignments"),F.push("RoleAssignments"));let T=c?`$orderby=${c} ${p?"asc":"desc"}`:"",S=[];a.forEach(E=>S.push(`${E.column} ${E.op??"eq"} '${E.value}'`)),b||S.push("FSObjType eq '0'");let A="$filter=("+S.join(") and (")+")",k="$select="+g,n="$expand="+F,r=m?`$top=${m}`:"",d=`/web/lists/GetByTitle('${e.config.def.title}')/items?${k}&${n}&${T}&${A}&${r}`,y=await ve(d);return{results:y?.d?.results,_next:y?.d?.__next}}async function ue(a){let c=await ve(a._next);return{results:c?.d?.results,_next:c?.d?.__next}}function de(a,c,p){var m=new SP.ClientContext.get_current,v=m.get_web(),b=v.get_lists().getByTitle(e.config.def.title),C=b.getItemById(a);function g(){let S={};c.forEach(A=>{var k=C.get_item(A);S[A]=Array.isArray(k)?k.map(n=>P(n)):P(k)}),p(S)}function F(S,A){console.error("SAL: findById - List: "+e.config.def.name),console.error("Fields",this),console.error(S,A)}var T={oListItem:C,callback:p,fields:c};m.load(C),m.executeQueryAsync(Function.createDelegate(T,g),Function.createDelegate(T,F))}function ne(a){return a?.ID?new Promise((c,p)=>{let m=new SP.ClientContext.get_current,C=m.get_web().get_lists().getByTitle(e.config.def.title).getItemById(a.ID),g=["ID","Author","Created","Editor","Modified"];Object.keys(a).filter(A=>!g.includes(A)).forEach(A=>{C.set_item(A,h(a[A]))}),C.update();function F(){console.log("Successfully updated "+this.oListItem.get_item("Title")),c()}function T(A,k){console.error("Update Failed - List: "+e.config.def.name),console.error("Item Id",this.oListItem.get_id()??"N/A"),console.error(a),console.error(A,k),p(k)}let S={oListItem:C,entity:a,resolve:c,reject:p};m.load(C),m.executeQueryAsync(Function.createDelegate(S,F),Function.createDelegate(S,T))}):!1}function Te(a,c){var p=new SP.ClientContext.get_current,m=p.get_web(),v=m.get_lists().getByTitle(e.config.def.title),b={callback:c};v.getItemById(a).deleteObject();function g(T,S){c()}function F(T,S){console.error("sal.SPList.deleteListItem: Request on list "+e.config.def.name+` failed, producing the following error: 
 `+S.get_message()+`
StackTrack: 
 `+S.get_stackTrace())}p.executeQueryAsync(Function.createDelegate(b,g),Function.createDelegate(b,F))}async function ht(a){let c=`/web/lists/GetByTitle('${e.config.def.title}')/items(${a})`;return await ve(c,"DELETE",{"If-Match":"*"})}async function Y(a,c,p){let v=new SP.ClientContext.get_current().get_web(),b=await Rt(a);return st(b,c,p)}async function st(a,c,p){p&&(a.resetRoleInheritance(),a.breakRoleInheritance(!1,!1));for(let m of c.roles){let v=await ut(m.principal.Title);if(!v)return;let b=new SP.ClientContext.get_current,C=b.get_web(),g=v.oPrincipal;b.load(g),m.roleDefs.map(T=>{let S=SP.RoleDefinitionBindingCollection.newObject(b);S.add(C.get_roleDefinitions().getByName(T.name)),a.get_roleAssignments().add(g,S)});let F={};await fi(b).catch(({sender:T,args:S})=>{console.error(`Failed to set role permissions on item id ${id} for principal ${m.principal.Title} `+S.get_message(),S)})}if(p){let m=new SP.ClientContext.get_current;a.get_roleAssignments().getByPrincipal(X.globalConfig.currentUser).deleteObject(),await fi(m).catch(({sender:v,args:b})=>{console.error(`Failed to remove role permissions on item id ${id} for Current User `+b.get_message(),b)})}}function Rt(a){return new Promise((c,p)=>{let m=new SP.ClientContext.get_current,C=m.get_web().get_lists().getByTitle(e.config.def.title).getItemById(a);m.executeQueryAsync(()=>{c(C)},(g,F)=>{console.error("Failed to find item: "+a+F.get_message(),F),p()})})}function vt(a){return new Promise((c,p)=>{var m=new SP.ClientContext.get_current,v=m.get_web(),b=v.get_lists().getByTitle(e.config.def.title),C=new SP.CamlQuery;C.set_viewXml('<View><Query><Where><Eq><FieldRef Name="ID"/><Value Type="Text">'+a+"</Value></Eq></Where></Query></View>");var g=b.getItems(C);m.load(g,"Include(ID, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))");function F(){for(var A=g.getEnumerator();A.moveNext();){for(var k=A.get_current(),n=new We({hasUniqueRoleAssignments:k.get_hasUniqueRoleAssignments(),roles:[]}),r=k.get_roleAssignments().getEnumerator();r.moveNext();){var d=r.get_current();let y=ct.fromJsomRole(d);n.roles.push(y)}c(n);break}}function T(A,k){p(k.get_message())}let S={oListItems:g,resolve:c,reject:p};m.executeQueryAsync(Function.createDelegate(S,F),Function.createDelegate(S,T))})}async function yt(){let a=`/web/lists/getByTitle('${e.config.def.name}')?$select=HasUniqueRoleAssignments,RoleAssignments&$expand=RoleAssignments/Member,RoleAssignments/RoleDefinitionBindings`,p=await ve(a,"GET",{"Cache-Control":"no-cache"});if(p)return We.fromRestResult(p.d)}function ke(a){let c=X.globalConfig.siteUrl;return c+=e.config.def.isLib?"/"+e.config.def.name:"/Lists/"+e.config.def.name,a&&(c+="/"+a),c}function it(a){return e.config.def.isLib?new Promise((c,p)=>Dt(a,c)):new Promise((c,p)=>Ct(a,c))}async function Ve(a){try{let p=(await bt(a)).map(m=>[m.LoginName,X.config.siteRoles.roles.RestrictedRead]);await Ye(a,p,!0)}catch(c){console.warn(c)}}async function Ge(a,c){let p=ke(a),m=X.globalConfig.siteUrl+`/_api/web/GetFolderByServerRelativeUrl('${p}')/ListItemAllFields/RoleAssignments?$expand=Member,Member/Users,RoleDefinitionBindings`,v=await fetch(m,{method:"GET",headers:{Accept:"application/json; odata=verbose"}});if(!v.ok){if(v.status==404)return;console.error(v)}let b=await v.json(),C=b?.d?.results;if(!C){console.warn("No results found",b);return}let g=c.filter(F=>{let T=F[0],S=F[1];return!C.find(k=>k.Member.LoginName!=T&&!k.Member.Users?.results.find(n=>n.LoginName==T)?!1:!!k.RoleDefinitionBindings.results?.find(n=>X.config.siteRoles.fulfillsRole(n.Name,S)))});console.log("Adding missing permissions",g),g.length&&await Ye(a,g,!1)}function wt(a,c){return new Promise((p,m)=>{let v=new SP.ClientContext.get_current,C=v.get_web().get_lists().getByTitle(e.config.def.title),g=ke(a),F=SP.CamlQuery.createAllItemsQuery();F.set_folderServerRelativeUrl(g);let T=C.getItems(F);v.load(T,`Include(${c.join(", ")})`),v.executeQueryAsync(function(){let S=[];for(var A=T.getEnumerator();A.moveNext();){var k=A.get_current(),n={};c.forEach(r=>{var d=k.get_item(r);n[r]=Array.isArray(d)?d.map(y=>P(y)):P(d)}),n.oListItem=k,S.push(n)}p(S)},function(S,A){console.warn("Unable load list folder contents:"),console.error(S),console.error(A),m(A)})})}async function bt(a){return new Promise(async(c,p)=>{let m=await St(a);if(!m){p("Folder item does not exist");return}let v=m.get_roleAssignments(),b=new SP.ClientContext.get_current;b.load(m),b.load(v),b.executeQueryAsync(function(){let C=new SP.ClientContext.get_current;console.log(m);let g=[],F=[],T=v.getEnumerator();for(;T.moveNext();){let S=T.get_current(),A=S.get_member(),k=S.get_roleDefinitionBindings();C.load(k),C.load(A),g.push({principal:A,bindings:k})}C.executeQueryAsync(function(S,A){let k=g.map(function({principal:n,bindings:r}){let d=[],y=r.getEnumerator();for(;y.moveNext();){let D=y.get_current();d.push(D.get_name())}return{ID:n.get_id(),Title:n.get_title(),LoginName:n.get_loginName(),Roles:d}});c(k)},function(S,A){console.warn("Unable load folder principals permissions:"),console.error(S),console.error(A),p(A)})},function(C,g){console.warn("Unable load folder permissions:"),console.error(C),console.error(g),p(g)})})}async function St(a){return new Promise((c,p)=>{let m=new SP.ClientContext.get_current,b=m.get_web().get_lists().getByTitle(e.config.def.title),C=SP.CamlQuery.createAllItemsQuery();var F='<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name="FSObjType"/><Value Type="int">1</Value></Eq><Eq><FieldRef Name="FileRef"/><Value Type="Text">'+ke(a)+"</Value></Eq></And></Where></Query><RowLimit>1</RowLimit></View>";C.set_viewXml(F);let T=b.getItems(C);async function S(){let n=[];for(var r=T.getEnumerator();r.moveNext();){let y=r.get_current();n.push(y)}n||(console.warn("folder not found"),c(n)),n.length>1&&(console.warn("Multiple folders found!"),c(n));let d=n[0];c(d)}function A(n,r){console.warn("Unable load list folder contents:"),console.error(n),console.error(r),p(r)}let k={allFolders:T,resolve:c,reject:p};m.load(T),m.executeQueryAsync(Function.createDelegate(k,S),Function.createDelegate(k,A))})}function Ct(a,c){var p=a.split("/"),m=0,v=function(b,C,g,F){var T=C[g];g++;var S=C.slice(0,g).join("/");At(S,function(A){g>=C.length?F(A.get_id()):v(S,C,g,F)},function(){e.createListFolder(T,function(A){g>=C.length?F(A):v(S,C,g,F)},b)})};v("",p,m,c)}e.createListFolder=function(a,c,p){p=p===void 0?"":p;let m=new SP.ClientContext.get_current,b=m.get_web().get_lists().getByTitle(e.config.def.title),C="",g=new SP.ListItemCreationInformation;g.set_underlyingObjectType(SP.FileSystemObjectType.folder),g.set_leafName(a),p&&(C=X.globalConfig.siteUrl+"/Lists/"+e.config.def.name+"/"+p,g.set_folderUrl(C));let F=b.addItem(g);F.set_item("Title",a),F.update();function T(k,n){c(this.newItem.get_id())}function S(k,n){alert("Request on list "+e.config.def.name+` failed, producing the following error: 
`+n.get_message()+`
StackTrack: 
`+n.get_stackTrace())}let A={folderName:a,callback:c,newItem:F};m.load(F),m.executeQueryAsync(Function.createDelegate(A,T),Function.createDelegate(A,S))};function At(a,c,p){var m=X.globalConfig.siteUrl+"/Lists/"+e.config.def.name+"/"+a,v=SP.ClientContext.get_current(),b=v.get_web().getFolderByServerRelativeUrl(m);b.get_listItemAllFields();var C={folder:b,path:a,onExists:c,onNonExists:p};v.load(b,"Exists","Name");function g(){if(b.get_exists()){let A=function(){c(S)},k=function(n,r){console.error("Failed to find folder at "+a,r)};console.log("Folder "+b.get_name()+" exists in "+e.config.def.name);var T=new SP.ClientContext.get_current,S=b.get_listItemAllFields();C={folderItem:S,path:a,onExists:c},T.load(S),T.executeQueryAsync(Function.createDelegate(C,A),Function.createDelegate(C,k))}else console.warn("Folder exists but is hidden (security-trimmed) for us.")}function F(T,S){S.get_errorTypeName()==="System.IO.FileNotFoundException"?(console.log("SAL.SPList.ensureListFolder:           Folder "+a+" does not exist in "+e.config.def.name),p()):console.error("Error: "+S.get_message())}v.executeQueryAsync(Function.createDelegate(C,g),Function.createDelegate(C,F))}function Dt(a,c){let v=new SP.ClientContext.get_current().get_web().get_lists().getByTitle(e.config.def.title);var b=function(C,g,F){var T=C.get_context(),S=g.split("/"),A=S[0],k=C.get_folders().add(A);T.load(k),T.executeQueryAsync(function(){if(S.length>1){var n=S.slice(1,S.length).join("/");b(k,n,F)}else F(k)},function(n,r){console.error("error creating new folder"),console.error(n),console.error(error)})};b(v.get_rootFolder(),a,c)}function Ye(a,c,p){return new Promise((m,v)=>{xt(a,c,m,p)})}function xt(a,c,p,m){m=m===void 0?!1:m;var v=[],b=[];let C=ke(a),g=new SP.ClientContext.get_current,T=g.get_web().getFolderByServerRelativeUrl(C);c.forEach(function(n){var r=gi(n[0]);r?.oGroup?b.push([r.oGroup,n[1]]):v.push([g.get_web().ensureUser(n[0]),n[1]])});function S(){var n=new SP.ClientContext.get_current,r=n.get_web(),d=this.folder.get_listItemAllFields();m?(d.resetRoleInheritance(),d.breakRoleInheritance(!1,!1),d.get_roleAssignments().getByPrincipal(X.globalConfig.currentUser).deleteObject()):d.breakRoleInheritance(!1,!1),this.resolvedGroups.forEach(function(_){var Q=SP.RoleDefinitionBindingCollection.newObject(n);Q.add(r.get_roleDefinitions().getByName(_[1])),d.get_roleAssignments().add(_[0],Q)}),this.users.forEach(function(_){var Q=SP.RoleDefinitionBindingCollection.newObject(n);Q.add(r.get_roleDefinitions().getByName(_[1])),d.get_roleAssignments().add(_[0],Q)});var y={folderItem:d,callback:p};function D(){console.log("Successfully set permissions"),this.callback(d)}function E(_,Q){console.error("Failed to update permissions on item: "+this.folderItem.get_lookupValue()+Q.get_message()+`
`+Q.get_stackTrace(),!1)}n.load(d),n.executeQueryAsync(Function.createDelegate(y,D),Function.createDelegate(y,E))}function A(n,r){console.error("Something went wrong setting perms on library folder",r)}var k={folder:T,users:v,callback:p,resolvedGroups:b,valuePairs:c,reset:m};v.map(function(n){g.load(n[0])}),g.load(T),g.executeQueryAsync(Function.createDelegate(k,S),Function.createDelegate(k,A))}function It(a,c,p,m){var v="";p.id&&(v=p.id);let b=SP.UI.$create_DialogOptions();var C=e.config.def.isLib?"/"+e.config.def.name+"/":"/Lists/"+e.config.def.name+"/",g="";p.rootFolder&&(g=X.globalConfig.siteUrl+C+p.rootFolder);var F=e.config.def.isLib?"/"+e.config.def.name+"/forms/":"/Lists/"+e.config.def.name+"/";Object.assign(b,{title:c,dialogReturnValueCallback:m,args:JSON.stringify(p),height:800,url:X.globalConfig.siteUrl+F+a+"?ID="+v+"&Source="+location.pathname+"&RootFolder="+g}),SP.UI.ModalDialog.showModalDialog(b)}function Tt(a,c){var p=SP.UI.$create_DialogOptions();p.title="Check in Document",p.height="600",p.dialogReturnValueCallback=c,p.url=X.globalConfig.siteUrl+"/_layouts/checkin.aspx?List={"+e.config.guid+"}&FileName="+a,SP.UI.ModalDialog.showModalDialog(p)}function kt(a,c){let p=`/web/GetFileByServerRelativeUrl('${a}')/CheckIn(comment='${c}',checkintype=0)`;return ve(p,"POST")}function l(a){return new Promise(c=>{var p=SP.UI.$create_DialogOptions();p.title="Version History",p.height="600",p.dialogReturnValueCallback=c,p.url=f(a),SP.UI.ModalDialog.showModalDialog(p)})}function f(a){return X.globalConfig.siteUrl+"/_layouts/15/versions.aspx?List={"+e.config.guid+"}&ID="+a}function R(a,c,p){return new Promise((m,v)=>{let b=new SP.ClientContext.get_current,g=b.get_web().get_lists().getByTitle(e.config.def.title);b.load(g),b.executeQueryAsync(function(){var F=X.globalConfig.siteUrl=="/"?"":X.globalConfig.siteUrl;let T=SP.UI.$create_DialogOptions();Object.assign(T,{title:c,dialogReturnValueCallback:m,args:JSON.stringify(p),url:F+"/_layouts/Upload.aspx?List="+g.get_id().toString()+"&RootFolder="+F+"/"+e.config.def.name+"/"+encodeURI(a)+"&Source="+location.pathname+"&args="+encodeURI(JSON.stringify(p))}),SP.UI.ModalDialog.showModalDialog(T)},function(F,T){console.error("Error showing file modal: "),console.error(F),console.error(T)})})}let I=10485760,x={start:"startupload",continue:"continueupload",finish:"finishupload"};async function M(a,c,p,m){let v=a,b=I,C=a.size,g=parseInt((C/b).toString(),10)+(C%b===0?1:0),F=c+"/"+p,T=bn(),S;for(m({currentBlock:0,totalBlocks:g}),S=await G(T,a.slice(0,b),F,c),i=2;i<g;i++)m({currentBlock:i,totalBlocks:g}),S=await q(T,a.slice(S,S+b),S,F);m({currentBlock:g-1,totalBlocks:g});let A=await L(T,a.slice(S),S,F);return m({currentBlock:g,totalBlocks:g}),A}async function G(a,c,p,m){let v=`/web/getFolderByServerRelativeUrl(@folder)/files/getByUrlOrAddStub(@file)/StartUpload(guid'${a}')?&@folder='${m}'&@file='${p}'`,g=await ve(v,"POST",{"Content-Type":"application/octet-stream"},{body:c});if(!g){console.error("Error starting upload!");return}return parseFloat(g.d.StartUpload)}async function q(a,c,p,m){let v=`/web/getFileByServerRelativeUrl(@file)/ContinueUpload(uploadId=guid'${a}',fileOffset=${p})?&@file='${m}'`,g=await ve(v,"POST",{"Content-Type":"application/octet-stream"},{body:c});if(!g){console.error("Error starting upload!");return}return parseFloat(g.d.ContinueUpload)}async function L(a,c,p,m){let v=`/web/getFileByServerRelativeUrl(@file)/FinishUpload(uploadId=guid'${a}',fileOffset=${p})?&@file='${m}'`,g=await ve(v,"POST",{"Content-Type":"application/octet-stream"},{body:c});if(!g){console.error("Error starting upload!");return}return g}async function W(a,c,p){return await fetch(_spPageContextInfo.webServerRelativeUrl+`/_api/web/GetFolderByServerRelativeUrl('${c}')/Files/add(url='${p}',overwrite=true)`,{method:"POST",credentials:"same-origin",body:a,headers:{Accept:"application/json; odata=verbose","Content-Type":"application/json;odata=nometadata","X-RequestDigest":document.getElementById("__REQUESTDIGEST").value}}).then(m=>{if(!m.ok){console.error("Error Uploading File",m);return}return m.json()})}async function H(a,c,p,m,v=null){v||(v=()=>{});let b=ke(p),C=null;if(a.size>I){let T=()=>M(a,b,c,v);C=await Sn.addJob(T)}else v({currentBlock:0,totalBlocks:1}),C=await W(a,b,c),v({currentBlock:1,totalBlocks:1});await pe(C.d,m),await kt(b+"/"+c,"");let g=C.d.ListItemAllFields.__deferred.uri+"?$select=ID";return(await ve(g)).d.ID}async function pe(a,c){var p=await fetch(a.ListItemAllFields.__deferred.uri,{method:"POST",credentials:"same-origin",body:JSON.stringify(c),headers:{Accept:"application/json; odata=nometadata","Content-Type":"application/json;odata=nometadata","X-RequestDigest":document.getElementById("__REQUESTDIGEST").value,"X-HTTP-Method":"MERGE","If-Match":"*"}}).then(m=>{if(!m.ok){console.error("Error Updating File",m);return}return m});return p}function oe(a,c,p,m){let v=ke(a),b=ke(c);var C=new SP.ClientContext.get_current,g=C.get_web(),F=g.getFolderByServerRelativeUrl(v);C.load(F,"Files"),C.executeQueryAsync(function(){for(var T=F.get_files(),S=T.getEnumerator(),A=[];S.moveNext();){var k=S.get_current(),n=b+"/"+k.get_name();A.push(n),k.copyTo(n,!0)}console.log(A),C.executeQueryAsync(function(){console.log("Files moved successfully!"),p()},function(r,d){console.log("error: ")+d.get_message()})},function(T,S){console.error("Unable to copy files: ",S.get_message()),console.error(T),console.error(S),reject(S)})}function J(a,c){return new Promise((p,m)=>{oe(a,c,p,m)})}async function te(){let a=await ve(`/web/lists/GetByTitle('${e.config.def.title}')`)}return{findByIdAsync:j,getById:ee,findByColumnValueAsync:le,loadNextPage:ue,getListItemsAsync:B,createListItemAsync:N,updateListItemAsync:ne,deleteListItemAsync:ht,setItemPermissionsAsync:Y,getItemPermissionsAsync:vt,getListPermissions:yt,setListPermissionsAsync:o,getFolderContentsAsync:wt,upsertFolderPathAsync:it,getServerRelativeFolderPath:ke,setFolderReadonlyAsync:Ve,setFolderPermissionsAsync:Ye,ensureFolderPermissionsAsync:Ge,uploadFileToFolderAndUpdateMetadata:H,uploadNewDocumentAsync:R,copyFilesAsync:J,showModal:It,showCheckinModal:Tt,showVersionHistoryModal:l,getVersionHistoryUrl:f}}async function ve(t,e="GET",s={},o={}){let u=t.startsWith("http")?t:X.globalConfig.siteUrl+"/_api"+t,h=await fetch(u,{method:e,headers:{Accept:"application/json; odata=verbose","X-RequestDigest":document.getElementById("__REQUESTDIGEST").value,...s},...o});if(!h.ok){if(h.status==404)return;console.error(h)}try{return await h.json()}catch{return}}function bn(){if(crypto.randomUUID)return crypto.randomUUID();let t=Date.now();return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){let s=(t+Math.random()*16)%16|0;return t=Math.floor(t/16),(e==="x"?s:s&3|8).toString(16)})}var X,mi,As,lr,We,ct,dt,Ds,Sn,as=O(()=>{window.console=window.console||{log:function(){}};window.sal=window.sal??{};X=window.sal,mi=_spPageContextInfo.webServerRelativeUrl=="/"?"":_spPageContextInfo.webServerRelativeUrl;X.globalConfig=X.globalConfig||{siteGroups:[],siteUrl:mi,listServices:mi+"/_vti_bin/ListData.svc/",defaultGroups:{}};X.site=X.site||{};window.DEBUG=!0;As={};lr=_spPageContextInfo.webAbsoluteUrl=="/"?"":_spPageContextInfo.webAbsoluteUrl;X.NewAppConfig=function(){var t={};t.roles={FullControl:"Full Control",Design:"Design",Edit:"Edit",Contribute:"Contribute",RestrictedContribute:"Restricted Contribute",InitialCreate:"Initial Create",Read:"Read",RestrictedRead:"Restricted Read",LimitedAccess:"Limited Access"},t.fulfillsRole=function(o,u){let h=Object.values(t.roles);return!h.includes(o)||!h.includes(u)?!1:h.indexOf(o)<=h.indexOf(u)},t.validate=function(){Object.keys(t.roles).forEach(function(o){var u=t.roles[o];X.globalConfig.roles.includes(u)?console.log(u):console.error(u+" is not in the global roles list")})};var e={groups:{Owners:"workorder Owners",Members:"workorder Members",Visitors:"workorder Visitors",RestrictedReaders:"Restricted Readers"}},s={siteRoles:t,siteGroups:e};return s};X.NewUtilities=function(){function t(w,N,P){P=P===void 0?null:P;var U=new SP.ClientContext.get_current,B=U.get_web(),j=new SP.GroupCreationInformation;j.set_title(w),this.oGroup=oWebsite.get_siteGroups().add(j),oGroup.set_owner(oWebsite.get_associatedOwnerGroup()),oGroup.update();var ee=SP.RoleDefinitionBindingCollection.newObject(clientContext);this.oRoleDefinitions=[],N.forEach(function(de){var ne=oWebsite.get_roleDefinitions().getByName(de);this.oRoleDefinitions.push(ne),ee.add(ne)});var ae=oWebsite.get_roleAssignments();ae.add(oGroup,ee);function ie(){var de=oGroup.get_title()+" created and assigned to "+oRoleDefinitions.forEach(function(ne){ne+""});P&&P(oGroup.get_id()),console.log(de)}function le(de,ne){alert(groupnName+" - Create group failed. "+ne.get_message()+`
`+ne.get_stackTrace())}clientContext.load(oGroup,"Title");var ue={groupName:w,oGroup,oRoleDefinition,callback:P};clientContext.executeQueryAsync(Function.createDelegate(ue,ie),Function.createDelegate(ue,le))}function e(w,N){var P=new SP.ClientContext.get_current,U=P.get_web(),B=U.ensureUser(w),j=B.get_groups();function ee(){for(var ie=new Array,le=new String,ue=j.getEnumerator();ue.moveNext();){var de=ue.get_current(),ne=Gt(de);le+=`
Group ID: `+de.get_id()+", Title : "+de.get_title(),ie.push(ne)}console.log(le.toString()),N(ie)}function ae(ie,le){console.error(" Everyone - Query Everyone group failed. "+le.get_message()+`
`+le.get_stackTrace())}P.load(B),P.load(j),data={everyone:B,oGroups:j,callback:N},P.executeQueryAsync(Function.createDelegate(data,ee),Function.createDelegate(data,ae))}function s(w,N){var P=new SP.ClientContext.get_current,U=w.get_users();function B(){for(var ae=[],ie=U.getEnumerator();ie.moveNext();){var le=ie.get_current(),ue=Gt(le);ae.push(ue)}N(ae)}function j(ae,ie){}var ee={oUsers:U,callback:N};P.load(U),P.executeQueryAsync(Function.createDelegate(ee,B),Function.createDelegate(ee,j))}function o(w,N,P,U){var B=new SP.ClientContext.get_current,j=B.get_web(),ee=j.getFolderByServerRelativeUrl(w);B.load(ee,"Files"),B.executeQueryAsync(function(){console.log("Got the source folder right here!");for(var ae=ee.get_files(),ie=ae.getEnumerator(),le=[];ie.moveNext();){var ue=ie.get_current(),de=N+"/"+ue.get_name();le.push(de),ue.copyTo(de,!0)}console.log(le),B.executeQueryAsync(function(){console.log("Files moved successfully!"),P()},function(ne,Te){console.log("error: ")+Te.get_message()})},function(ae,ie){console.log("Sorry, something messed up: "+ie.get_message())})}function u(w,N){return new Promise((P,U)=>{o(w,N,P,U)})}var h={copyFiles:o,copyFilesAsync:u,createSiteGroup:t,getUserGroups:e,getUsersWithGroup:s};return h};We=class t{constructor({hasUniqueRoleAssignments:e,roles:s}){this.hasUniqueRoleAssignments=e,this.roles=s}hasUniqueRoleAssignments;roles=[];addPrincipalRole(e,s){let o=new dt({name:s}),u=this.getPrincipalRole(e);if(u){u.addRoleDef(o);return}let h=new ct({principal:e});h.addRoleDef(o),this.roles.push(h)}getPrincipalRole(e){return this.roles.find(s=>s.principal.ID==e.ID)}principalHasPermissionKind(e,s){return!!this.getPrincipalRole(e)?.roleDefs.find(u=>u.basePermissions?.has(s))}getValuePairs(){return this.roles.flatMap(e=>e.roleDefs.map(s=>[e.principal.Title,s.name]))}static fromRestResult(e){let s=e.RoleAssignments.results.map(ct.fromRestRoleAssignment);return new t({hasUniqueRoleAssignments:e.HasUniqueRoleAssignments,roles:s})}},ct=class t{constructor({principal:e,roleDefs:s=[]}){this.principal=e,this.roleDefs=s}principal;roleDefs=[];addRoleDef(e){this.roleDefs.push(e)}static fromRestRoleAssignment(e){return new t({principal:{...e.Member,ID:e.Member.Id},roleDefs:e.RoleDefinitionBindings.results.map(dt.fromRestRoleDef)})}static fromJsomRole(e){let s=new t({principal:Gt(e.get_member())});var o=e.get_roleDefinitionBindings();if(o!=null)for(var u=o.getEnumerator();u.moveNext();){var h=u.get_current();s.roleDefs.push(dt.fromJsomRoleDef(h))}return s}},dt=class t{constructor({name:e,basePermissions:s=null}){this.name=e,this.basePermissions=s}name;basePermissions;static fromRestRoleDef(e){let s=new t({name:e.Name,basePermissions:e.BasePermissions});return Object.assign(s,e),s}static fromJsomRoleDef(e){let s=new t({name:e.get_name()});return s.basePermissions=e.get_basePermissions(),s}};window.fetchSharePointData=ve;Ds=class{constructor(e){this.maxConcurrency=e,this.runningJobs=0,this.queue=[]}addJob(e){return new Promise((s,o)=>{let u=async()=>{try{let h=await e();s(h)}catch(h){o(h)}finally{this.runningJobs--,this.processQueue()}};this.queue.push(u),this.processQueue()})}processQueue(){for(;this.runningJobs<this.maxConcurrency&&this.queue.length>0;){let e=this.queue.shift();this.runningJobs++,e()}}},Sn=new Ds(5)});async function bi(t){let e=await Ri(t);return e?e.map(s=>new People(s)):[]}var Si=O(()=>{as()});var Ie=O(()=>{ui();Cs();pi();as();Si()});var qe,Ci=O(()=>{Ie();bs();Ss();Ie();as();ye();qe=class extends me{constructor(e){super(e),this.spGroupName=e.spGroupName??null,this.multiple=e.multiple??!1,this.Value=this.multiple?ko.observableArray():ko.observable(),ko.isObservable(this.spGroupName)&&this.spGroupName.subscribe(this.spGroupNameChangedHandler),ko.unwrap(this.spGroupName)&&this.spGroupNameChangedHandler(ko.unwrap(this.spGroupName))}spGroupId=ko.observable();userOpts=ko.observableArray();expandUsers=ko.observable(!1);spGroupNameChangedHandler=async e=>{e||(this.userOpts.removeAll(),this.spGroupId(null));let s=await ut(e);this.spGroupId(s.ID);let o=await bi(e);this.userOpts(o.sort(li))};pickerOptions=ko.pureComputed(()=>{let e=ko.unwrap(this.spGroupId),s={AllowMultipleValues:this.multiple};return e&&(s.SharePointGroupID=e),s});toString=ko.pureComputed(()=>this.multiple?this.Value()?.map(e=>e.Title):this.Value()?.Title);set=e=>{if(!this.multiple){this.Value(Pe.Create(e));return}if(!e){this.Value.removeAll();return}let s=e.results??e;if(!s.length){this.Value.removeAll();return}this.Value(s.map(o=>Pe.Create(o)))};components=Ot}});var Le,Ai=O(()=>{je();ye();Le=class extends me{constructor({displayName:e,isRequired:s=!1,Visible:o,options:u,multiple:h=!1,optionsText:w,instructions:N}){super({Visible:o,displayName:e,isRequired:s,instructions:N}),this.Options(u),this.multiple=h,this.Value=h?ko.observableArray():ko.observable(),this.optionsText=w,this.components=this.multiple?Xe:Ut}toString=ko.pureComputed(()=>this.multiple?this.Value().join(", "):this.Value());get=()=>this.Value();set=e=>{if(e&&this.multiple){Array.isArray(e)?this.Value(e):this.Value(e.results??e.split(";#"));return}this.Value(e)};Options=ko.observableArray()}});var $e,Di=O(()=>{je();ye();$e=class extends me{constructor(e){super(e),this.isRichText=e.isRichText,this.attr=e.attr??{}}components=qt}});var K,xi=O(()=>{je();ye();K=class extends me{constructor(e){super(e),this.attr=e.attr??{},this.options=e.options??null}components=Lt}});var ye=O(()=>{Js();ii();ni();oi();ai();Ci();Ai();Di();xi()});var Z,lt=O(()=>{Oe();ye();Z=class extends at{constructor(e){super(e)}toJSON=()=>{let e={};return Object.keys(this.FieldMap).map(s=>e[s]=this.FieldMap[s]?.get()),e};fromJSON(e){window.DEBUG&&console.log("Setting constrained entity from JSON",e),Object.keys(e).map(s=>this.FieldMap[s]?.set(e[s]))}get FieldMap(){let e={};return Object.entries(this).filter(([s,o])=>o instanceof me).map(([s,o])=>{s=o.systemName??s,e[s]=o}),e}FormFields=()=>Object.values(this.FieldMap);validate=(e=!0)=>(Object.values(this.FieldMap).map(s=>s?.validate&&s.validate(e)),this.Errors());Errors=ko.pureComputed(()=>Object.values(this.FieldMap).filter(e=>e?.Errors&&e.Errors()).flatMap(e=>e.Errors()));IsValid=ko.pureComputed(()=>!this.Errors().length)}});var Bt,Ii=O(()=>{Ee();ot();lt();ye();Ce();Bt=class extends Z{constructor(e){super(e)}Title=new K({displayName:"Title",required:!0});FileName=new K({displayName:"Name",systemName:"FileLeafRef",required:!0});FileRef=new K({displayName:"File Link",systemName:"FileRef"});ReqNum=new be({displayName:"Request Number",type:Se,lookupCol:"Title",required:!0,entitySet:z.AuditRequests});ActionOffice=new be({displayName:"Action Offices",type:_e,options:Be,optionsFilter:ko.pureComputed(()=>{let e=ko.unwrap(this.ReqNum.Value);if(!e)return o=>o;let s=ko.unwrap(e.ActionOffice.Value);return o=>s.includes(o)}),lookupCol:"Title",multiple:!0,entitySet:z.AuditOrganizations});static Views={All:["ID","Title","FileLeafRef","FileRef","ReqNum","ActionOffice"],AOCanUpdate:["Title","FileLeafRef","ActionOffice"]};static ListDef={title:"AuditCoversheets",name:"AuditCoversheets",isLib:!0}}});var ls,Ti=O(()=>{lt();ls=class extends Z{constructor(e){super(e)}static Views={All:["ID","Title","To","Body","NotificationType","ReqNum","ResID"]};static ListDef={name:"AuditEmails",title:"AuditEmails"}}});var ts,_e,xs=O(()=>{lt();ts={ACTIONOFFICE:"Action Office",REQUESTINGOFFICE:"Requesting Office",QUALITYASSURANCE:"Quality Assurance",SPECIALPERMISSIONS:"Special Permissions",RESTRICTEDREADERS:"Restricted Readers"},_e=class extends Z{constructor(e){super(e)}static Views={All:["ID","Title","Country","Organization_x0020_Description","EmailGroup","Org_Type","Post_x0020_Code","UserGroup","Role"]};static ListDef={name:"AuditOrganizations",title:"AuditOrganizations"}}});var Cn,us,Se,Mt=O(()=>{xs();ye();Oe();ss();ot();Ce();Cn={OPEN:"Open",CANCELLED:"Canceled",CLOSED:"Closed",REOPENED:"ReOpened"},us={TASKER:"Tasker",REQUEST:"Request",NOTIFICATION:"Notification"},Se=class extends Z{constructor(e){super(e),this.InternalDueDate.addFieldRequirement({requirement:ko.pureComputed(()=>this.InternalDueDate.Value()>this.ReqDueDate.Value()),error:new rt("text-field","required-field","The Internal Due Date must be before the Request Due Date!")})}ReqType=new Le({displayName:"Request Type",options:Object.values(us),isRequired:!0,instructions:ko.pureComputed(()=>{switch(this.ReqType.Value()){case us.TASKER:return"A request that doesn't require QA Approval.";case us.REQUEST:return"A request requiring QA Approval";case us.NOTIFICATION:return"A request that is closed after the email is sent";default:}})});ReqNum=new K({displayName:"Request Number",systemName:"Title",isRequired:!0});ReqSubject=new K({displayName:"Request Subject",isRequired:!0});RequestingOffice=new be({displayName:"Requesting Office",type:_e,options:Be,optionsFilter:js,lookupCol:"Title",entitySet:z.AuditOrganizations,isRequired:!0});FiscalYear=new K({displayName:"Fiscal Year",isRequired:!0});InternalDueDate=new Ae({displayName:"Internal Due Date",type:we.date,isRequired:!0});ReqDueDate=new Ae({displayName:"Request Due Date",type:we.date,isRequired:!0});ReqStatus=new Le({displayName:"Request Status",options:Object.values(Cn),isRequired:!0});IsSample=new Vt({displayName:"Is Sample?"});ReceiptDate=new Ae({displayName:"Receipt Date",type:we.date,isRequired:!1});RelatedAudit=new K({displayName:"Related Audit",isRequired:!1,instructions:"The Audit Request number of the similar audit performed in the previous FY"});ActionItems=new $e({displayName:"Action Items",instructions:"Items that have been requested by the Auditor",isRichText:!0,isMinimalEditor:!0,classList:["min-w-full"]});Comments=new $e({displayName:"Comments",isRichText:!0,isMinimalEditor:!0,classList:["min-w-full"]});Reminders=new Le({displayName:"Reminders",options:["3 Days Before Due","1 Day Before Due","1 Day Past Due","3 Days Past Due","7 Days Past Due"],multiple:!0});EmailSent=new Vt({displayName:"Email has been sent"});Sensitivity=new Le({displayName:"Sensitivity",options:["None","Official","SBU","PII_SBU"]});ActionOffice=new be({displayName:"Action Offices",type:_e,options:Be,optionsFilter:ws,lookupCol:"Title",multiple:!0,entitySet:z.AuditOrganizations});EmailActionOffice=new be({displayName:"Email Action Offices",type:_e,options:Be,optionsFilter:ws,lookupCol:"Title",multiple:!0,entitySet:z.AuditOrganizations});ClosedDate=new Ae({displayName:"Closed Date",isRequired:!1});ClosedBy=new qe({displayName:"Closed By",isRequired:!1});static Views={All:["ID","Title","ReqType","ReqSubject","FiscalYear","InternalDueDate","ReqDueDate","ReqStatus","IsSample","ReceiptDate","RelatedAudit","ActionItems","Comments","Reminders","EmailSent","Sensitivity","ActionOffice","EmailActionOffice","RequestingOffice","ClosedDate","ClosedBy"],New:["Title","ReqType","ReqSubject","RequestingOffice","FiscalYear","InternalDueDate","ReqDueDate","ReqStatus","IsSample","ReceiptDate","RelatedAudit","ActionItems","Comments","Reminders","Sensitivity","ActionOffice"],IACanUpdate:["ReqType","ReqSubject","FiscalYear","RequestingOffice","InternalDueDate","ReqDueDate","ReqStatus","IsSample","ReceiptDate","RelatedAudit","ActionItems","Comments","Reminders","Sensitivity","ActionOffice","EmailActionOffice","ClosedBy","ClosedDate"]};static ListDef={name:"AuditRequests",title:"AuditRequests"}}});var cs,ki=O(()=>{Mt();cs=class extends Se{constructor(e){super(e)}toRequest(){let e=new Se(this);return e.fromJSON(this.toJSON()),e}static Views={All:["ID","Title","ReqSubject","FiscalYear","InternalDueDate","ReqDueDate","ReqStatus","IsSample","ReceiptDate","RelatedAudit","ActionItems","Comments","Reminders","EmailSent","Sensitivity","ActionOffice","EmailActionOffice","EmailActionOffice","ClosedDate","ClosedBy"],New:["Title","ReqSubject","FiscalYear","InternalDueDate","ReqDueDate","ReqStatus","IsSample","ReceiptDate","RelatedAudit","ActionItems","Comments","Reminders","Sensitivity","ActionOffice"]};static ListDef={name:"AuditBulkRequests",title:"AuditBulkRequests"}}});var pt,Is=O(()=>{Oe();ye();pt=class t extends Z{constructor(e){super(e)}id=new K({displayName:"ID"});text=new K({displayName:"Comment"});author=new K({displayName:"author"});timestamp=new K({displayName:"timestamp"});FieldMap={id:this.id,text:this.text,author:this.author,timestamp:this.timestamp};static Create({id:e,text:s,author:o,timestamp:u}){let h=new t;return h.id.Value(e),h.text.Value(s),h.author.Value(o),h.timestamp.Value(u),h}static Views={All:["id","text","author","timestamp"]}}});var Je,ds=O(()=>{Oe();ye();Je=class extends Z{id=new K({displayName:"ID"});viewer=new K({displayName:"Viewer"});timestamp=new Ae({displayName:"Timestamp",type:we.datetime});FieldMap={id:this.id,viewer:this.viewer,timestamp:this.timestamp};static Views={All:["id","viewer","timestamp"]}}});var mt,Ts=O(()=>{ds();Ce();mt=class{constructor({entity:e,fieldName:s}){this.entity=e,this.blobField=e[s],this.fieldName=s,this.viewers=this.blobField.TypedValues}entity;blobField;fieldName;pushCurrentUser(){this.pushUser(_spPageContextInfo.userLoginName)}pushUser(e){var s=this.viewers().filter(function(u){return u.viewer!=e});this.viewers(s);var o=new Je;o.fromJSON({id:Math.ceil(Math.random()*1e6).toString(16),viewer:e,timestamp:new Date().toLocaleString()}),this.viewers.push(o),this.commitChanges()}removeUser(e){this.viewers.remove(e),this.commitChanges()}removeCurrentuser(){this.removeUserByLogin(_spPageContextInfo.userLoginName)}removeUserByLogin(e){var s=this.viewers().find(function(o){return o.viewer==e});s&&this.removeUser(s)}onRemove=e=>{confirm("Are you sure you want to delete this item?")&&this.removeUser(e)};async commitChanges(){let e=z.Set(this.entity.constructor);if(!e){alert("Cannot find entity set",this.entity);return}await e.UpdateEntity(this.entity,[this.fieldName])}}});var Fi,Pi=O(()=>{Ie();Fi=os`
  <div>
    <!-- ko if: showHistoryBool -->
    <!-- ko foreach: comments -->
    <div class="comment">
      <div data-bind="text: text.Value"></div>
      <div>
        <span
          data-bind="text: author.Value() + ' @ ' + timestamp.Value()"
        ></span
        ><span class="remove" data-bind="click: $parent.onRemove">x</span>
      </div>
    </div>
    <!-- /ko -->
    <!-- /ko -->
    <!-- ko ifnot: showHistoryBool -->
    <div class="comment" data-bind="with: comments()[comments().length - 1]">
      <div data-bind="text: text.Value"></div>
      <div>
        <span
          data-bind="text: author.Value() + ' @ ' + timestamp.Value()"
        ></span
        ><span class="remove" data-bind="click: $parent.onRemove">x</span>
      </div>
    </div>
    <!-- /ko -->
    <a
      title="Show hidden comments"
      href="javascript:void(0)"
      data-bind="click: toggleShowHistory"
    >
      <span class="ui-icon ui-icon-comment"></span>
      Toggle Comment History (<span data-bind="text: comments().length"></span>
      Total)
    </a>
    <div class="newComment">
      <textarea cols="50" data-bind="value: newCommentText"></textarea>
      <button type="button" data-bind="click: onSubmit">Submit</button>
    </div>
  </div>
`});var _i,ps,ks,Ni=O(()=>{Ce();Ie();Is();Pi();_i="commentChain",ps=class{constructor({entity:e,fieldName:s}){this.entity=e,this.blobField=e[s],this.fieldName=s}entity;blobField;fieldName;componentName=_i},ks=class{constructor({entity:e,fieldName:s,blobField:o}){this.entity=e,this.fieldName=s,this.blobField=o,this.comments=o.TypedValues}newCommentText=ko.observable();showHistoryBool=ko.observable(!1);toggleShowHistory=function(){this.showHistoryBool(!this.showHistoryBool())};async onSubmit(){var e=pt.Create({id:Math.ceil(Math.random()*1e6).toString(16),text:this.newCommentText(),author:_spPageContextInfo.userLoginName,timestamp:new Date().toLocaleString()});this.blobField.add(e),await this.commitChanges(),this.newCommentText("")}onRemove=e=>{confirm("Are you sure you want to delete this item?")&&(this.blobField.remove(e),this.commitChanges())};async commitChanges(){let e=z.Set(this.entity.constructor);if(!e){alert("Cannot find entity set",this.entity);return}await e.UpdateEntity(this.entity,[this.fieldName])}};rs(_i,{template:Fi,viewModel:ks})});var $t,Ei=O(()=>{ye();lt();Mt();Is();ds();Ts();Ni();Ce();$t=class extends Z{constructor(e){super(e)}ActiveViewers=new Ze({displayName:"Active Viewers",entityType:Je,multiple:!0});InternalStatus=new Ze({displayName:"Internal Status",entityType:pt,multiple:!0});ReqNum=new be({displayName:"Request",type:Se,lookupCol:"Title",entitySet:z.AuditRequests});commentChainComponent=new ps({entity:this,fieldName:"InternalStatus"});activeViewersComponent=new mt({entity:this,fieldName:"ActiveViewers"});static Views={All:["ID","ActiveViewers","InternalStatus","ReqNum"]};static ListDef={title:"AuditRequestsInternal",name:"AuditRequestsInternal"}}});var $a,Qa,Fs,Oi,tt=O(()=>{et();Ie();$a=ko.observable(!1),Qa=ko.observable(!1),Fs=class t extends Pe{constructor({ID:e,Title:s,LoginName:o=null,LookupValue:u=null,WorkPhone:h=null,EMail:w=null,IsGroup:N=null,IsEnsured:P=!1,Groups:U=null}){super({ID:e,Title:s,LookupValue:u,LoginName:o,IsGroup:N,IsEnsured:P}),this.WorkPhone=h,this.EMail=w,this.Groups=U}Groups=[];isInGroup(e){return e?.ID?this.getGroupIds().includes(e.ID):!1}getGroupIds(){return this.Groups.map(e=>e.ID)}IsSiteOwner=ko.pureComputed(()=>this.isInGroup(hi().owners));hasSystemRole=e=>{let s=this.IsSiteOwner();switch(e){case systemRoles.Admin:return s;case systemRoles.ActionOffice:return s||this.ActionOffices().length;default:}};static _user=null;static Create=async function(){if(t._user)return t._user;let e=await vi();return t._user=new t(e),t._user}},Oi=Fs.Create});var Qt,Qe,Ps=O(()=>{Oe();ye();Ee();Ce();ds();Ts();ot();tt();Qt={Open:"1-Open",Submitted:"2-Submitted",ReturnedToAO:"3-Returned to Action Office",ApprovedForQA:"4-Approved for QA",ReturnedToGFS:"5-Returned to GFS",RepostedAfterRejection:"6-Reposted After Rejection",Closed:"7-Closed"},Qe=class extends Z{constructor(e){super(e)}Title=new K({displayName:"Name"});ReqNum=new be({displayName:"Request Number",type:Se,entitySet:z.AuditRequests});SampleNumber=new K({displayName:"Sample Number",isRequired:!0});ResStatus=new Le({displayName:"Response Status",options:Object.values(Qt)});ReturnReason=new K({displayName:"Return Reason",options:["Incomplete Document","Incorrect POC"]});Comments=new $e({displayName:"Comments",isRichText:!0,isMinimalEditor:!0,classList:["min-w-full"]});ClosedDate=new Ae({displayName:"Closed Date",type:we.date});ClosedBy=new qe({displayName:"Closed By"});POC=new qe({displayName:"POC"});POCCC=new qe({displayName:"POCCC"});ActionOffice=new be({displayName:"Action Office",type:_e,options:Be,optionsFilter:ko.pureComputed(()=>{let e=ko.unwrap(this.ReqNum.Value);if(!e)return o=>o;let s=ko.unwrap(e.ActionOffice.Value);return o=>s.includes(o)}),entitySet:z.AuditOrganizations,lookupCol:"Title",isRequired:!0});ActiveViewers=new Ze({displayName:"Active Viewers",entityType:Je,multiple:!0});activeViewersComponent=new mt({entity:this,fieldName:"ActiveViewers"});async uploadResponseDocFile(e){let s={Title:e.name,ReqNumId:this.ReqNum.Value().ID,ResIDId:this.ID},{appContext:o}=await Promise.resolve().then(()=>(Ce(),Ui));return await o.AuditResponseDocs.UploadFileToFolderAndUpdateMetadata(e,e.name,this.Title.Value(),s)}markClosed(){this.ResStatus.Value(Qt.Closed),this.ClosedDate.set(new Date),this.ClosedBy.set(Oi())}static Views={All:["ID","Title","SampleNumber","ResStatus","ReturnReason","Comments","ClosedDate","ClosedBy","POC","POCCC","ReqNum","ActionOffice","ActiveViewers"],NewForm:["ReqNum","ActionOffice","SampleNumber","Comments"],EditForm:["ReqNum","SampleNumber","Title","ActionOffice","ResStatus","ReturnReason","Comments","ClosedDate","ClosedBy","POC","POCCC"],IACanUpdate:["Title","ActionOffice","ResStatus","ReturnReason","Comments","ClosedDate","ClosedBy","POC","POCCC"],IAUpdateClosed:["ResStatus","ClosedDate","ClosedBy"]};static ListDef={name:"AuditResponses",title:"AuditResponses"}}});var ms,qi=O(()=>{Ee();ms=class extends Qe{constructor(e){super(e)}static ListDef={name:"AuditBulkResponses",title:"AuditBulkResponses"}}});var fs,ft,Li=O(()=>{Oe();ye();Ps();Mt();Ce();fs={Open:"Open",Submitted:"Submitted",SentToQA:"Sent to QA",Approved:"Approved",Rejected:"Rejected",Archived:"Archived",MarkedForDeletion:"Marked for Deletion"},ft=class extends Z{constructor(e){super(e)}Title=new K({displayName:"Name"});ReceiptDate=new Ae({displayName:"Receipt Date",type:we.date});DocumentStatus=new Le({displayName:"Document Status",options:Object.values(fs)});RejectReason=new $e({displayName:"Reject Reason"});ReqNum=new be({displayName:"Request Number",type:Se,entitySet:z.AuditRequests});ResID=new be({displayName:"Response ID",type:Qe,entitySet:z.AuditResponses});FileName=new K({displayName:"Name",systemName:"FileLeafRef"});FileRef=new K({displayName:"File Link",systemName:"FileRef"});Modified=new Ae({displayName:"Modified",type:we.datetime});Editor=new qe({displayName:"Modified By"});Created=new Ae({displayName:"Created",type:we.datetime});FileSizeDisplay=new K({displayName:"File"});File_x0020_Type=new K({displayName:"File Type",systemName:"File_x0020_Type"});CheckoutUser=new qe({displayName:"Checked Out To"});markApprovedForRO(e){this.DocumentStatus.Value(fs.Approved),this.RejectReason.Value(""),this.FileName.Value()!=e&&this.FileName.Value(e)}static Views={All:["ID","Title","ReceiptDate","DocumentStatus","RejectReason","ReqNum","ResID","FileLeafRef","FileRef","FileSizeDisplay","File_x0020_Type","CheckoutUser","Modified","Editor","Created"],EditForm:["FileLeafRef","Title","ReceiptDate","DocumentStatus","RejectReason","ReqNum","ResID"],AOCanUpdate:["Title","ReceiptDate","DocumentStatus","RejectReason","FileLeafRef"],UpdateDocStatus:["Title","FileLeafRef","DocumentStatus"]};static ListDef={name:"AuditResponseDocs",title:"AuditResponseDocs",isLib:!0}}});var Ht,Vi=O(()=>{Oe();Ht=class extends Z{constructor(e){super(e)}markApprovedForRO(e,s){this.ReqNum=e.Title,this.ResID=s.Title.toString(),this.FiscalYear=e.FiscalYear.toString(),this.ReqSubject=e.ReqSubject.toString(),this.RequestingOffice=e.RequestingOffice.Value()?.UserGroup?.Title}static Views={All:["ID","Title","ReqNum","ResID","FiscalYear","RequestingOffice","ReqSubject","FileLeafRef","FileRef"],ApprovedForROUpdate:["ReqNum","ResID","FiscalYear","ReqSubject","RequestingOffice"]};static ListDef={name:"AuditResponseDocsRO",title:"AuditResponseDocsRO"}}});var jt,_s=O(()=>{Oe();jt=class t extends Z{constructor(e){super(e)}Responses="";ResponseCount=0;static Views={All:["ID","Title","RequestingOffice","Responses","ResponseCount","SentEmail"]};static ListDef={name:"AuditROEmailLog",title:"AuditROEmailLog",fields:t.Views.All}}});var gs,Gi=O(()=>{Oe();gs=class extends Z{constructor(e){super(e)}key;value;FieldMap={Title:{get:()=>this.key,set:e=>this.key=e},Value:{get:()=>this.value,set:e=>this.value=e}};static Views={All:["ID","Title","Value"]};static ListDef={name:"Config",title:"Config"}}});var Ee=O(()=>{Ii();Ti();xs();Mt();ki();Ei();Ps();qi();Li();Vi();_s();Gi()});function Ke(t,e){hs&&console.log(`ApplicationDBContext: ${e.constructor.name}: `,t),!(!t||!e)&&Object.keys(t).forEach(s=>{An(s,t[s],e)})}function An(t,e,s){if(hs&&console.log(`ApplicationDBContext: ${s.constructor.name}.${t} to ${e}`),s.FieldMap&&s.FieldMap[t]){Dn(e,s.FieldMap[t]);return}if(s[t]&&typeof s[t]=="function"){s[t](e);return}s[t]=e}function Dn(t,e){if(typeof e=="function"){e(t);return}if(typeof e!="object"){e=t;return}if(e.set&&typeof e.set=="function"){e.set(t);return}if(e.obs){if(!t){e.obs(null);return}let s=Array.isArray(t)?t.map(o=>Bi(o,e)):Bi(t,e);e.obs(s);return}e=t}function Bi(t,e){return e.factory?e.factory(t):t}function Mi(t,e=null){let s={},o=new Set([]);this?.ListDef?.fields&&this.ListDef.fields.forEach(w=>o.add(w)),this?.AllDeclaredFields&&this.AllDeclaredFields.map(w=>o.add(w)),t.FieldMap&&Object.keys(t.FieldMap).forEach(w=>o.add(w));let u=[...o];return(e??(t.FieldMap?Object.keys(t.FieldMap):null)??Object.keys(t)).filter(w=>u.includes(w)).map(w=>{if(t.FieldMap&&t.FieldMap[w]){let N=t.FieldMap[w].systemName??w;s[N]=xn(t.FieldMap[w]);return}s[w]=t[w]}),s}function xn(t){return typeof t=="function"?t():t.get&&typeof t.get=="function"?t.get():t.obs?t.obs():t}var hs,Wt,he,$i=O(()=>{et();Ie();hs=!1,Wt=class{constructor(){}Pages=new he(is);utilities={copyFileAsync:yi};virtualSets=new Map;Set=e=>{let s=e.ListDef.name,o=Object.values(this).filter(u=>u.constructor.name==he.name).find(u=>u.ListDef?.name==s);if(o)return o;if(!this.virtualSets.has(s)){let u=new he(listDef);return this.virtualSets.set(s,u),u}return this.virtualSets.get(s)}},he=class{constructor(e){if(!e.ListDef){console.error("Missing entityType listdef for",e);return}this.entityType=e;try{let s=new Set;e.Views?.All?.map(o=>s.add(o)),this.AllDeclaredFields=[...s]}catch(s){console.warn("Could not instantiate",e),console.warn(s),this.AllDeclaredFields=e.Views?.All??[]}this.ListDef=e.ListDef,this.Views=e.Views,this.Title=e.ListDef.title,this.Name=e.ListDef.name,this.ListRef=new wi(e.ListDef),this.entityConstructor=this.entityType.FindInStore||this.entityType.Create||this.entityType}FindById=async(e,s=this.AllDeclaredFields)=>{let o=await this.ListRef.getById(e,s);if(!o)return null;let u=new this.entityType(o);return Ke(o,u),u};FindByColumnValue=async(e,{orderByColumn:s,sortAsc:o},{count:u=null,includePermissions:h=!1,includeFolders:w=!1},N=this.AllDeclaredFields)=>{let P=u!=null;u=u??5e3;let U=await this.ListRef.findByColumnValueAsync(e,{orderByColumn:s,sortAsc:o},{count:u,includePermissions:h,includeFolders:w},N),B={_next:U._next,results:U.results.map(ee=>{let ae=new this.entityConstructor(ee);return Ke(ee,ae),ae})};if(P)return B;let j={results:B.results};for(;B._next;)B=await this.LoadNextPage(B),j.results=j.results.concat(B.results);return j};LoadNextPage=async e=>{let s=await this.ListRef.loadNextPage(e);return{_next:s._next,results:s.results.map(o=>{let u=new this.entityType(o);return Ke(o,u),u})}};ToList=async(e=!1)=>{let s=this.Views.All;return(await this.ListRef.getListItemsAsync({fields:s})).map(h=>{let w=new this.entityType(h);return Ke(h,w),w})};LoadEntity=async function(e,s=!1){if(!e.ID)return console.error("entity missing Id",e),!1;let o=await this.ListRef.getById(e.ID,this.AllDeclaredFields);return o?(Ke(o,e),e):null};AddEntity=async function(e,s){let u=Mi.bind(this)(e,this.AllDeclaredFields);hs&&console.log(u);let h=await this.ListRef.createListItemAsync(u,s);Ke({ID:h},e)};UpdateEntity=async function(e,s=null){let o=Mi.bind(this)(e,s);return o.ID=typeof e.ID=="function"?e.ID():e.ID,hs&&console.log(o),this.ListRef.updateListItemAsync(o)};RemoveEntity=async function(e){return e.ID?(await this.ListRef.deleteListItemAsync(e.ID),!0):!1};RemoveEntityById=function(e){return this.ListRef.deleteListItemAsync(e)};GetItemPermissions=function(e){return this.ListRef.getItemPermissionsAsync(e.ID)};SetItemPermissions=async function(e,s,o=!1){return this.ListRef.setItemPermissionsAsync(e.ID,s,o)};GetRootPermissions=function(){return this.ListRef.getListPermissions()};SetRootPermissions=async function(e,s){await this.ListRef.setListPermissionsAsync(e,s)};GetFolderUrl=function(e=""){return this.ListRef.getServerRelativeFolderPath(e)};GetItemsByFolderPath=async function(e,s=this.AllDeclaredFields){return(await this.ListRef.getFolderContentsAsync(e,s)).map(u=>{let h=new this.entityType(u);return Ke(u,h),h})};UpsertFolderPath=async function(e){return this.ListRef.upsertFolderPathAsync(e)};RemoveFolderByPath=async function(e){let o=(await this.FindByColumnValue([{column:"FileLeafRef",value:e}],{},{},["ID","Title","FileLeafRef"],!0)).results??[];for(let u of o)await this.RemoveEntityById(u.ID)};SetFolderReadOnly=async function(e){return this.ListRef.setFolderReadonlyAsync(e)};SetFolderPermissions=async function(e,s,o=!0){let u=s.filter(h=>h[0]&&h[1]).map(h=>[h[0].getKey(),h[1]]);return this.ListRef.setFolderPermissionsAsync(e,u,o)};EnsureFolderPermissions=async function(e,s){let o=s.filter(u=>u[0]&&u[1]).map(u=>[u[0].LoginName??u[0].Title,u[1]]);return this.ListRef.ensureFolderPermissionsAsync(e,o)};UploadFileToFolderAndUpdateMetadata=async function(e,s,o,u,h){let w=await this.ListRef.uploadFileToFolderAndUpdateMetadata(e,s,o,u,h),N=await this.ListRef.getById(w,this.AllDeclaredFields),P=new this.entityConstructor(N);return Ke(N,P),P};UploadNewDocument=async function(e,s){return this.ListRef.uploadNewDocumentAsync(e,"Attach a New Document",s)};CopyFolderContents=async function(e,s){return this.ListRef.copyFilesAsync(e,s)};ShowForm=async function(e,s,o){return new Promise((u,h)=>this.ListRef.showModal(e,s,o,u))};CheckInDocument=async function(e){return new Promise(s=>this.ListRef.showCheckinModal(e,s))};EnsureList=async function(){}}});var Qi=O(()=>{$i()});var Ui={};en(Ui,{ApplicationDbContext:()=>Rs,appContext:()=>z});var Rs,z,Ce=O(()=>{Ee();Qi();Rs=class extends Wt{constructor(){super()}AuditBulkRequests=new he(cs);AuditBulkResponses=new he(ms);AuditConfigurations=new he(gs);AuditCoversheets=new he(Bt);AuditEmails=new he(ls);AuditOrganizations=new he(_e);AuditResponses=new he(Qe);AuditResponseDocs=new he(ft);AuditResponseDocsRO=new he(Ht);AuditRequests=new he(Se);AuditRequestsInternals=new he($t);AuditROEmailsLog=new he(jt)},z=new Rs});window.Audit=window.Audit||{};Audit.Common=Audit.Common||{};function tn(){Audit.Common.Utilities=new Audit.Common.NewUtilities,Audit.Common.Init()}Audit.Common.Init=function(){};Audit.Common.NewUtilities=function(){var t=_spPageContextInfo.webServerRelativeUrl,e="AuditRequests",s="AuditRequests",o="AuditRequestsInternal",u="AuditRequestsInternal",h="AuditResponses",w="AuditResponses",N="AuditRequestDocs",P="AuditRequestDocs",U="AuditCoverSheets",B="AuditCoverSheets",j="AuditResponseDocs",ee="AuditResponseDocs",ae="AuditResponseDocsEA",ie="AuditResponseDocsEA",le="AuditOrganizations",ue="AuditOrganizations",de="AuditEmails",ne="AuditEmails",Te="AuditBulkResponses",ht="AuditBulkResponses",Y="AuditBulkPermissions",st="AuditBulkPermissions",Rt="CGFS Special Access1",vt="CGFS Special Access2",yt="Quality Assurance",ke="External Auditors",it=null,Ve=null,Ge=null;function wt(n=!1){if(n){location.href=location.pathname;return}var r=location.pathname;if($("#tabs").html()!=null&&$("#tabs").html()!=""){var d=0;try{d=$("#tabs").tabs("option","active")}catch{}if(r+="?Tab="+d,d==0&&$("#ddlResponseName").val()!="")r+="&ResNum="+$("#ddlResponseName").val();else if(d==1){var y=$("#ddlResponsesOpen").val(),D=$("#ddlResponsesProcessed").val();y!=null&&y!=""?r+="&ResNum="+y:D!=null&&D!=""&&(r+="&ResNum="+D)}location.href=r}else location.reload()}function bt(){var n=new Date;$("#divLoading").text("Loaded at "+n.format("MM/dd/yyyy hh:mm tt"))}function St(){var n=GetUrlKeyValue("Tab");n!=null&&n!=""&&$("#tabs").tabs("option","active",n);var r=!1,d=GetUrlKeyValue("ResNum");d!=null&&d!=""&&(n==0?$("#ddlResponseName option[value='"+d+"']").length>0&&($("#ddlResponseName").val(d).change(),r=!0):$("#ddlResponsesOpen option[value='"+d+"']").length>0?$("#ddlResponsesOpen").val(d).change():$("#ddlResponsesProcessed option[value='"+d+"']").length>0&&$("#ddlResponsesProcessed").val(d).change()),r||$(".sr-response-item").show()}function Ct(n,r){var d=0,y=0,D=0,E=0,_=0,Q=$(".sr-response-item");Q.each(function(){var re=$.trim($(this).find(".sr-response-requestStatus").text()),ge=$.trim($(this).find(".sr-response-status").text());(ge==n||ge==r)&&(re=="Open"||re=="ReOpened")&&($(this).addClass("highlighted"),d++,ge==n?E++:ge==r&&_++,re=="Open"?y++:re=="ReOpened"&&D++)}),d>0?($("#lblStatusReportResponsesMsg").html("<span class='ui-icon ui-icon-alert'></span>There are "+d+" Responses pending your review"),E>0&&_==0?$("#ddlResponseStatus").val(n).change():_>0&&E==0&&$("#ddlResponseStatus").val(r).change()):$("#lblStatusReportResponsesMsg").html("<span class='ui-icon ui-icon-circle-check'></span>There are 0 Responses pending your review")}function At(n){Ve=new Array;for(var r=n.getEnumerator();r.moveNext();){var d=r.get_current(),y=d.get_id(),D=d.get_loginName(),E=d.get_title(),_=new Object;_.ID=y,_.loginName=D,_.title=E,_.group=d,Ve.push(_)}}function Dt(n){var r=null;if(Ve!=null){for(var d=0;d<Ve.length;d++)if(Ve[d].title==n){r=Ve[d].group;break}}return r}function Ye(n){Ge=new Array;for(var r=n.getEnumerator();r.moveNext();){var d=r.get_current(),y=d.get_item("ID"),D=d.get_item("Title"),E=d.get_item("UserGroup");E!=null?E=E.get_lookupValue():E="";var _=new Object;_.ID=y,_.title=D,_.userGroup=E,Ge.push(_)}}function xt(n){var r=null;if(Ge!=null)for(var d=0;d<Ge.length;d++){var y=Ge[d];if(y.title==n){r=y.userGroup;break}}return r}function It(n,r,d){if(n==null||r==""||r==null||d==null)return!1;var y=!1,D=n.get_roleAssignments();if(D==null)return alert("Error retrieving role assignments"),!1;for(var E=D.getEnumerator();E.moveNext();){var _=E.get_current();if(_!=null){var Q=_.get_member();if(Q.isPropertyAvailable("Title")){var re=Q.get_title(),ge=_.get_roleDefinitionBindings();if(ge!=null)for(var Fe=ge.getEnumerator();Fe.moveNext();){var De=Fe.get_current(),Ne=De.get_name();if(re==r&&De.get_basePermissions().has(d)){y=!0;break}}}}}return y}function Tt(n,r){if(!r){var d=!1;$("#ddlResponsesOpen > option").each(function(){if($(this).text()==n)return d=!0,notifyId=SP.UI.Notify.addNotification("Displaying Response ("+n+")",!1),$("#ddlResponsesOpen").val(n).change(),!1}),d||$("#ddlResponsesProcessed > option").each(function(){if($(this).text()==n)return d=!0,notifyId=SP.UI.Notify.addNotification("Displaying Response ("+n+")",!1),$("#ddlResponsesProcessed").val(n).change(),!1}),$("#tabs").tabs({active:1})}}function kt(n){var r={};return n=="Archived"?r={"background-color":"Gainsboro"}:n=="Approved"?r={"background-color":"PaleGreen"}:n=="Rejected"?r={"background-color":"LightSalmon"}:n=="Sent to QA"?r={"background-color":"LightCyan"}:n=="Submitted"?r={"background-color":"LemonChiffon"}:n=="Marked for Deletion"&&(r={"background-color":"Gainsboro","font-style":"italic"}),r}function l(n){var r="";return n=="Archived"?r=" style='background-color:Gainsboro;' ":n=="Approved"?r=" style='background-color:PaleGreen;' ":n=="Rejected"?r=" style='background-color:LightSalmon;' ":n=="Sent to QA"?r=" style='background-color:LightCyan;' ":n=="Submitted"?r=" style='background-color:LemonChiffon;' ":n=="Marked for Deletion"&&(r=" style='background-color:Gainsboro; font-style:italic' title='Marked for Deletion by the Action Office' "),r}function f(n,r){for(var d=!1,y=n.getEnumerator();y.moveNext();){var D=y.get_current(),E=D.get_displayName();if(E==r){var d=!0;break}}return d}var R=0,I=0;function x(n,r,d,y){R=0,I=0;var D=new SP.ClientContext.get_current,E=D.get_web(),_=new SP.ListItemCreationInformation;_.set_underlyingObjectType(SP.FileSystemObjectType.folder),_.set_leafName(r),oNewEmailFolder=n.addItem(_),oNewEmailFolder.set_item("Title",r),oNewEmailFolder.update(),this.currentUser=E.get_currentUser(),this.ownerGroup=E.get_associatedOwnerGroup(),this.memberGroup=E.get_associatedMemberGroup(),this.visitorGroup=E.get_associatedVisitorGroup(),oNewEmailFolder.resetRoleInheritance(),oNewEmailFolder.breakRoleInheritance(!1,!1);var Q=SP.RoleDefinitionBindingCollection.newObject(D);Q.add(E.get_roleDefinitions().getByType(SP.RoleType.administrator));var re=SP.RoleDefinitionBindingCollection.newObject(D);re.add(E.get_roleDefinitions().getByType(SP.RoleType.contributor));var ge=SP.RoleDefinitionBindingCollection.newObject(D);ge.add(E.get_roleDefinitions().getByName("Restricted Read"));var Fe=SP.RoleDefinitionBindingCollection.newObject(D);Fe.add(E.get_roleDefinitions().getByName("Restricted Contribute")),oNewEmailFolder.get_roleAssignments().add(ownerGroup,Q),oNewEmailFolder.get_roleAssignments().add(memberGroup,re),oNewEmailFolder.get_roleAssignments().add(visitorGroup,ge);var De=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameQA());De!=null&&oNewEmailFolder.get_roleAssignments().add(De,Fe),oNewEmailFolder.get_roleAssignments().getByPrincipal(currentUser).deleteObject();function Ne(){if(this.requestItem){var xe=this.requestItem.get_item("ActionOffice");if(xe==null||xe.length==0){this.OnComplete&&this.OnComplete(!0);return}for(var nt=0;nt<xe.length;nt++){var Yi=xe[nt].get_lookupValue(),Xi=Audit.Common.Utilities.GetAOSPGroupName(Yi),Os=Audit.Common.Utilities.GetSPSiteGroup(Xi);if(Os!=null){let Ls=function(){I++,I==R&&this.OnComplete&&this.OnComplete(!0)},Vs=function(Ln,Vn){I++,I==R&&this.OnComplete&&this.OnComplete(!0)};var Un=Ls,qn=Vs;R++;var ys=new SP.ClientContext.get_current,Zi=ys.get_web(),Us=SP.RoleDefinitionBindingCollection.newObject(ys);Us.add(Zi.get_roleDefinitions().getByName("Restricted Contribute")),this.oNewEmailFolder.get_roleAssignments().add(Os,Us);var qs={OnComplete:this.OnComplete};ys.executeQueryAsync(Function.createDelegate(qs,Ls),Function.createDelegate(qs,Vs))}}}else this.OnComplete&&this.OnComplete(!0)}function Me(xe,nt){statusId=SP.UI.Status.addStatus("Request failed: "+nt.get_message()+`
`+nt.get_stackTrace())}var He={requestItem:d,oNewEmailFolder,OnComplete:y};D.executeQueryAsync(Function.createDelegate(He,Ne),Function.createDelegate(He,Me))}function M(n,r){var d=n,y=r;let D,E;d==null&&(d=""),y==null&&(y="");var _=d.lastIndexOf("-");if(_>=0){var Q=d.substring(0,_+1),re=d.replace(Q,""),ge=parseInt(re,10),Fe=Audit.Common.Utilities.PadDigits(ge,5);D=Q+Fe}else D=d;var De=y.lastIndexOf("-");if(De>=0){var Ne=y.substring(0,De+1),Me=y.replace(Ne,""),He=parseInt(Me,10),xe=Audit.Common.Utilities.PadDigits(He,5);E=Ne+xe}else E=y;return D.toLowerCase().localeCompare(E.toLowerCase())}function G(n,r){var d=n.title,y=r.title,D,E;d==null&&(d=""),y==null&&(y="");var _=d.lastIndexOf("-");if(_>=0){var Q=d.substring(0,_+1),re=d.replace(Q,""),ge=parseInt(re,10),Fe=Audit.Common.Utilities.PadDigits(ge,5);D=Q+Fe}else D=d;var De=y.lastIndexOf("-");if(De>=0){var Ne=y.substring(0,De+1),Me=y.replace(Ne,""),He=parseInt(Me,10),xe=Audit.Common.Utilities.PadDigits(He,5);E=Ne+xe}else E=y;return D.toLowerCase().localeCompare(E.toLowerCase())}function q(n,r){return n.toLowerCase().localeCompare(r.toLowerCase())}function L(n,r){return n==""?-1:r==""?1:new Date(n).getTime()-new Date(r).getTime()}function W(n,r,d,y){if(n!=null){y?n.sort(M):d?n.sort(L):n.sort(q);var D=new Array,E=-1;D[++E]="<option value=''>-Select-</option>";for(var _=n.length,Q=0;Q<_;Q++){var re=$.trim(n[Q]);D[++E]="<option value='"+re+"'>"+re+"</option>"}var ge=$(r);ge.empty().append(D.join(""))}}function H(n,r){if(n==null)return!1;for(var d=n.length,y=0;y<d;y++)if(n[y]==r)return!0;return!1}function pe(n){return n==!0?"<span class='ui-icon ui-icon-check'>"+n+"</span>":"<span class='ui-icon ui-icon-close'>"+n+"</span>"}function oe(n,r){var d=n.get_item(r);return d==null?"":d.get_lookupValue()}function J(n,r){n=n.toString();var d="";if(r>n.length)for(let y=0;y<r-n.length;y++)d+="0";return d+n.toString()}function te(n,r){var d=n>=0?1:-1;return(Math.round(n*Math.pow(10,r)+d*.001)/Math.pow(10,r)).toFixed(r)}function ce(n){return n==null||n==""?"":(n>1048576?n=Audit.Common.Utilities.PreciseRound(n/1048576,2)+" MB":n>1024?n=Audit.Common.Utilities.PreciseRound(n/1024,2)+" KB":n+=" B",n)}function a(n){function r(d){return d<10?"0"+d:d}return n.getUTCFullYear()+"-"+r(n.getUTCMonth()+1)+"-"+r(n.getUTCDate())+"T"+r(n.getUTCHours())+":"+r(n.getUTCMinutes())+":"+r(n.getUTCSeconds())+"Z"}function c(){$(".requestInfo-response-doc img").click(function(n){n.preventDefault();var r=$(this).attr("src");r=="/_layouts/images/minus.gif"?$(this).attr("src","/_layouts/images/plus.gif"):$(this).attr("src","/_layouts/images/minus.gif"),$(this).parent().parent().nextUntil("tr.requestInfo-response-doc").each(function(){$(this).toggleClass("collapsed")})})}function p(n){return $("select[title='"+n+"']").html()!==null?$("select[title='"+n+"']"):$("input[title='"+n+"']")}function m(n){return $("select[title='"+n+"']").html()!==null?$("select[title='"+n+"'] option:selected").text():$("input[title='"+n+"']").val()}function v(n,r){try{if(r==null)return;var d=C("select","",n);if(d==null){var y=C("input","",n);ShowDropdown(y.id);var D=document.getElementById(y.opt);b(D,r),OptLoseFocus(D)}else b(d,r)}catch{}}function b(n,r){var d=n.options,y=d.length;if(n!=null){for(var D=0;D<y;D++)if(d[D].text==r)return n.selectedIndex=D,!0;return!1}}function C(n,r,d){for(var y=r.length,D=document.getElementsByTagName(n),E=0;E<D.length;E++){var _=D[E].id;if(D[E].title==d&&(r==""||_.indexOf(r)==_.length-y))return D[E]}return null}function g(n){var r=SP.UI.$create_DialogOptions();r.title="User Manual",r.height=250,n!=null?r.url=Audit.Common.Utilities.GetSiteUrl()+"/pages/AuditUserManuals.aspx?FilterField1=DocType&FilterValue1="+n:r.url=Audit.Common.Utilities.GetSiteUrl()+"/pages/AuditUserManuals.aspx",SP.UI.ModalDialog.showModalDialog(r)}function F(n,r){var d=new Date,y=Audit.Common.Utilities.GetSiteUrl(),D=y+"/siteassets/css/tablesorter/style.css?v="+d.format("MM_dd_yyyy"),E=y+"/siteAssets/css/audit_styles.css?v="+d.format("MM_dd_yyyy"),_=$(r).html(),Q=$("<div>").append(_);Q.find(".sr-response-title a").each(function(){$(this).removeAttr("onclick"),$(this).removeAttr("href")}),_=Q.html();var re=d.format("MM/dd/yyyy hh:mm tt");re="<div style='padding-bottom:10px;'>"+re+"</div>",_=re+_;var ge=$("<div></div>"),Fe=$("<div></div>"),De=$.Deferred(),Ne=$.Deferred(),Me="";ge.load(D,function(){Me+="<style>"+ge.html()+"</style>",De.resolve()}),Fe.load(E,function(){Me+="<style>"+Fe.html()+"</style>",Ne.resolve()}),$.when(De,Ne).done(function(){var He=`<HTML>
<HEAD>

<Title>`+n+`</Title>
`+Me+`
<style>.hideOnPrint, .rowFilters {display:none}</style>
</HEAD>
<BODY>
`+_+`
</BODY>
</HTML>`,xe=window.open("","printWebPart");xe.document.open(),xe.document.write(He),xe.document.close(),xe.print()})}function T(n,r,d){var y=S(r);d==!0&&(y=y.slice(1));var D=A(y);if(navigator.userAgent.search("Trident")>=0)window.CsvExpFrame.document.open("text/html","replace"),window.CsvExpFrame.document.write(D),window.CsvExpFrame.document.close(),window.CsvExpFrame.focus(),window.CsvExpFrame.document.execCommand("SaveAs",!0,n+".csv");else{var E="data:text/csv;charset=utf-8,"+escape(D),_=document.createElement("a");_.href=E,_.download=n+".csv",document.body.appendChild(_),_.click(),document.body.removeChild(_)}}function S(n){var r=document.getElementById(n);if(r.innerHTML.indexOf("rowFilters")>=0){var d=$("<div>").append(r.outerHTML);d.find(".rowFilters").each(function(){$(this).remove()}),r=d.find("table")[0]}if(r.innerHTML.indexOf("footer")>=0){var d=$("<div>").append(r.outerHTML);d.find(".footer").each(function(){$(this).remove()}),r=d.find("table")[0]}for(var y=[],D=0,E=r.rows.length;D<E;D++){y[D]=[];for(var _=0,Q=r.rows[D].cells.length;_<Q;_++){var re=r.rows[D].cells[_].textContent||r.rows[D].cells[_].innerText;y[D][_]=re.trim()}}return y}function A(n){for(var r=typeof n!="object"?JSON.parse(n):n,d=`sep=,\r
`,y="",D,E,_=0;_<r.length;_++){y="";var Q=r[_];for(D in Q)Q.hasOwnProperty(D)&&(E=Q[D]+"",y+='"'+E.replace(/"/g,'""')+'",');y=y.slice(0,-1),d+=y+`\r
`}return d}var k={GetSiteUrl:function(){return t=="/"?"":t},GetListTitleRequests:function(){return e},GetListNameRequests:function(){return s},GetListTitleRequestsInternal:function(){return o},GetListNameRequestsInternal:function(){return u},GetListTitleResponses:function(){return h},GetListNameResponses:function(){return w},GetLibTitleRequestDocs:function(){return N},GetLibNameRequestDocs:function(){return P},GetLibTitleCoverSheets:function(){return U},GetLibNameCoverSheets:function(){return B},GetLibTitleResponseDocs:function(){return j},GetLibNameResponseDocs:function(){return ee},GetLibTitleResponseDocsEA:function(){return ae},GetLibNameResponseDocsEA:function(){return ie},GetListTitleActionOffices:function(){return le},GetListNameActionOffices:function(){return ue},GetListTitleEmailHistory:function(){return de},GetListNameEmailHistory:function(){return ne},GetListTitleBulkResponses:function(){return Te},GetListNameBulkResponses:function(){return ht},GetListTitleBulkPermissions:function(){return Y},GetListNameBulkPermissions:function(){return st},GetGroupNameSpecialPerm1:function(){return Rt},GetGroupNameSpecialPerm2:function(){return vt},GetGroupNameQA:function(){return yt},GetGroupNameEA:function(){return ke},Refresh:wt,OnLoadDisplayTimeStamp:bt,OnLoadDisplayTabAndResponse:St,OnLoadFilterResponses:function(n,r){Ct(n,r)},SetResponseDocLibGUID:function(n){it=n},GetResponseDocLibGUID:function(){return it},LoadSiteGroups:function(n){At(n)},GetSPSiteGroup:function(n){return Dt(n)},LoadActionOffices:function(n){Ye(n)},GetActionOffices:function(){return Ge},GetAOSPGroupName:function(n){return xt(n)},CheckSPItemHasGroupPermission:function(n,r,d){return It(n,r,d)},GoToResponse:function(n,r){Tt(n,r)},GetResponseDocStyleTag:function(n){return l(n)},GetResponseDocStyleTag2:function(n){return kt(n)},CheckIfEmailFolderExists:function(n,r){return f(n,r)},CreateEmailFolder:function(n,r,d,y){return x(n,r,d,y)},AddOptions:function(n,r,d,y){W(n,r,d,y)},ExistsInArr:function(n,r){return H(n,r)},GetTrueFalseIcon:function(n){return pe(n)},PadDigits:function(n,r){return J(n,r)},PreciseRound:function(n,r){return te(n,r)},GetFriendlyFileSize:function(n){return ce(n)},GetISODateString:function(n){return a(n)},GetFriendlyDisplayName:function(n,r){return oe(n,r)},BindHandlerResponseDoc:c,PrintStatusReport:function(n,r){F(n,r)},ExportToCsv:function(n,r,d){T(n,r,d)},ViewUserManuals:function(n){g(n)},GetLookupDisplayText:function(n){return m(n)},GetLookupFormField:function(n){return p(n)},SetLookupFromFieldNameByText:function(n,r){return v(n,r)},SortResponseObjects:function(n,r){return G(n,r)},SortResponseTitles:M};return k};tn();var sn=String.raw,$s,Qs=sn($s||($s=Ms([`
  <link
    rel="stylesheet"
    type="text/css"
    href="/sites/CGFS/Style Library/apps/audit/lib/jquery-ui-1.13.2/jquery-ui.theme.min.css"
  />
  <link
    rel="stylesheet"
    type="text/css"
    href="/sites/CGFS/Style Library/apps/audit/lib/tablesorter-2.31.3/css/theme.default.min.css"
  />
  <!--
  <script
    type="text/javascript"
    src="/sites/CGFS/Style Library/apps/audit/lib/jquery-3.7.1.min.js"
  ><\/script>
  <script
    type="text/javascript"
    src="/sites/CGFS/Style Library/apps/audit/lib/jquery-ui-1.13.2/jquery-ui.min.js"
  ><\/script>

  <script
    type="text/javascript"
    src="/sites/CGFS/Style Library/apps/audit/lib/tablesorter-2.31.3/js/jquery.tablesorter.min.js"
  ><\/script>
  <script
    type="text/javascript"
    src="/sites/CGFS/Style Library/apps/audit/lib/knockout-3.5.1.js"
  ><\/script>
  -->

  <iframe id="CsvExpFrame" style="display: none"></iframe>

  <div
    id="divCounter"
    style="display: none"
    title="used to auto refresh the page"
  >
    600
  </div>

  <div class="audit">
    <!-- ko with: blockingTasks -->
    <div
      class="tasks blocking dimmer"
      data-bind="css: {'active': $data.length}"
    >
      <span class="loader"></span>
      <ul class="" data-bind="foreach: $data">
        <li data-bind="text: msg + '... ' + Status()"></li>
      </ul>
    </div>
    <!-- /ko -->

    <!-- ko with: runningTasks -->
    <div class="tasks running">
      <ul class="" data-bind="foreach: $data">
        <li data-bind="text: msg + '... ' + Status()"></li>
      </ul>
    </div>
    <!-- /ko -->
    <div id="divLoading" style="color: green; padding-bottom: 10px">
      Please Wait... Loading
      <span
        data-bind="visible: arrResponses().length > 0 && debugMode, text: arrResponses().length"
      ></span>
    </div>
    <div id="divUsersGroups" style="color: green; padding-bottom: 10px"></div>
    <div class="audit-body">
      <div class="reports-container">
        <div id="divRefresh" class="quick-links" style="display: none">
          <div>
            <a
              title="Refresh this page"
              href="javascript:void(0)"
              data-bind="click: refresh"
              ><span class="ui-icon ui-icon-refresh"></span>Refresh</a
            >
          </div>
          <div>
            <a
              title="View User Manual"
              href="javascript:void(0)"
              onclick="Audit.Common.Utilities.ViewUserManuals('AO User Manual')"
              ><span class="ui-icon ui-icon-help"></span>User Manual</a
            >
          </div>
          <div>
            <a title="Help" href="mailto:cgfsauditrequests@state.gov"
              ><span class="ui-icon ui-icon-mail-closed"></span>Request Help</a
            >
          </div>
        </div>
        <div id="" style="margin-top: 20px">
          <!-- ko using: tabs -->
          <ul class="ui-tabs-nav" data-bind="foreach: tabOpts">
            <li
              data-bind="text: linkText, 
            click: $parent.clickTabLink, 
            css: {active: $parent.isSelected($data)}"
            ></li>
          </ul>
          <!-- ko foreach: tabOpts -->
          <div
            data-bind="template: {
              name: template.id,
              data: template.data
            },
            visible: $parent.isSelected($data)"
          ></div>
          <!-- /ko -->
          <!-- /ko -->
        </div>
      </div>
    </div>
  </div>

  <script type="text/html" id="responseStatusReportTemplate">
    <div id="tabs-0">
      <div
        id="lblStatusReportResponsesMsg"
        style="padding-top: 5px; color: green"
      >
        <span
          data-bind="css: (cntPendingReview() > 0 ? 'ui-icon ui-icon-alert' : 'ui-icon ui-icon-circle-check')"
        ></span
        >There are <span data-bind="text: cntPendingReview"></span> Responses
        pending your review
      </div>
      <div
        id="divButtons"
        style="padding-top: 3px"
        data-bind="visible: arrResponses().length > 0"
      >
        <a
          id="btnPrint1"
          title="Click here to Print"
          href="javascript:void(0)"
          class="hideOnPrint"
          ><span class="ui-icon ui-icon-print">Print</span></a
        >
        <a class="export1 hideOnPrint" title="Export to CSV" href="#"
          ><span class="ui-icon ui-icon-disk">Export to CSV</span></a
        >
        <a
          id="btnViewAll"
          title="View All"
          href="javascript:void(0)"
          data-bind="visible: arrFilteredResponsesCount() < arrResponses().length && doSort, click: ClearFiltersResponseTab"
          ><span class="ui-icon ui-icon-circle-zoomout"></span>View All
          Responses</a
        >
      </div>

      <div id="divStatusReportRespones">
        <table
          id="tblStatusReportResponses"
          class="tablesorter report"
          data-bind="visible: arrResponses().length > 0"
        >
          <thead>
            <tr
              valign="top"
              class="rowFilters"
              data-bind="visible: arrResponses().length > 0"
            >
              <th class="sorter-false filter" nowrap="nowrap">
                <select
                  id="ddlResponseName"
                  data-bind="options: $root.ddOptionsResponseTabResponseTitle, value: filterResponseTabResponseName, optionsCaption: '-Select-'"
                ></select>
              </th>
              <th class="sorter-false" nowrap="nowrap"></th>
              <th class="sorter-false filter" nowrap="nowrap">
                <select
                  id="ddlResponseRequestInternalDueDate"
                  data-bind="options: $root.ddOptionsResponseTabRequestInternalDueDate, value: filterResponseTabRequestIntDueDate, optionsCaption: '-Select-'"
                ></select>
              </th>
              <th class="sorter-false filter" nowrap="nowrap">
                <select
                  id="ddlResponseStatus"
                  data-bind="options: $root.ddOptionsResponseTabResponseStatus, value: filterResponseTabResponseStatus, optionsCaption: '-Select-'"
                ></select>
              </th>
              <th class="sorter-false"></th>
              <th class="sorter-false"></th>
            </tr>
            <tr valign="top">
              <th class="sorter-true" nowrap="nowrap">Response Name</th>
              <th class="sorter-false" nowrap="nowrap">Response Subject</th>
              <th class="sorter-true" nowrap="nowrap">Due Date</th>
              <th class="sorter-true" nowrap="nowrap">Response Status</th>
              <th class="sorter-true" nowrap="nowrap"># of Documents</th>
              <th class="sorter-true" nowrap="nowrap">Modified</th>
            </tr>
          </thead>
          <tbody id="fbody">
            <!-- ko foreach: arrResponses -->
            <tr
              class="sr-response-item"
              data-bind="css: {'highlighted': highlight}"
            >
              <td class="sr-response-title">
                <a
                  href="javascript:void(0);"
                  title="Go to Response Details"
                  data-bind="text: title,
          click: () => Audit.AOReport.Report.GoToResponse(title)"
                >
                </a>
              </td>
              <td
                class="sr-response-requestSubject"
                data-bind="text: requestSubject"
              ></td>
              <td
                class="sr-response-internalDueDate"
                data-bind="text: internalDueDate"
              ></td>
              <td class="sr-response-status" data-bind="text: status"></td>
              <td class="sr-response-docCount" data-bind="text: docCount"></td>
              <td class="sr-response-modified" data-bind="text: modified"></td>
            </tr>
            <!-- /ko -->
          </tbody>
          <tfoot class="footer">
            <tr>
              <th colspan="6">
                Displaying
                <span
                  id="spanResponsesDisplayedTotal"
                  style="color: green"
                  data-bind="text: arrFilteredResponsesCount()"
                  >0</span
                >
                out of
                <span
                  id="spanResponsesTotal"
                  style="color: green"
                  data-bind="text: arrResponses().length"
                  >0</span
                >
                Responses
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  <\/script>

  <script type="text/html" id="responseDetailTemplate">
    <div id="tabs-1">
      <div style="padding-bottom: 15px">
        <table>
          <tr>
            <td><span>Responses Pending Action:</span></td>
            <td>
              <select
                id="ddlResponsesOpen"
                data-bind="options: $root.ddOptionsResponseInfoTabResponseNameOpen2, value: filterResponseInfoTabResponseNameOpen2, optionsCaption: '-Select-'"
              ></select>
            </td>
          </tr>
          <tr>
            <td><span>Other Responses:</span></td>
            <td>
              <select
                id="ddlResponsesProcessed"
                data-bind="options: $root.ddOptionsResponseInfoTabResponseNameProcessed2, value: filterResponseInfoTabResponseNameProcessed2, optionsCaption: '-Select-'"
              ></select>
            </td>
          </tr>
        </table>
      </div>
      <div class="response-detail-view">
        <div
          id="divResponseInfo"
          class="audit-form response-info-form"
          data-bind="with: currentResponse"
        >
          <div class="form-header">
            <h3 class="uppercase form-title">
              AUDIT RESPONSE DETAILS
              <div class="fw-semibold" data-bind="text: title"></div>
            </h3>
            <!-- <button
          type="button"
          class="btn btn-link form-title"
          data-bind="click: $parent.refreshRequest"
        >
          <i title="Refresh Request" class="fa-solid fa-arrows-rotate"></i>
        </button> -->
          </div>

          <div class="form-row uppercase">
            <dl>
              <dt>Subject</dt>
              <dd>
                <span
                  id="requestInfoSubject"
                  data-bind="text: request.subject"
                ></span>
              </dd>
              <dt>Due Date</dt>
              <dd>
                <span
                  id="requestInfoInternalDueDate"
                  data-bind="text: request.internalDueDate"
                ></span>
              </dd>
            </dl>
            <dl>
              <dt>Response Status</dt>
              <dd>
                <span
                  id="responseInfoStatus"
                  data-bind="style: { color:  resStatus == '7-Closed' ? 'red' : 'green' }"
                >
                  <span data-bind="text: resStatus"></span
                  ><span data-bind="visible: resStatus == '7-Closed'">
                    on <span data-bind="text: closedDate "></span> by
                    <span data-bind="text: closedBy"></span>
                  </span>
                </span>
              </dd>
              <dt>Action Office</dt>
              <dd>
                <span id="responseInfoAO" data-bind="text: actionOffice"></span>
                <span data-bind="visible: poc" style="color: green">POC: </span
                ><span data-bind="text: poc" style="color: green"></span>
              </dd>
              <dt>Related Audit</dt>
              <dd>
                <span
                  id="requestInfoRelatedAudit"
                  data-bind="text: request.relatedAudit"
                ></span>
              </dd>
            </dl>
          </div>
          <div class="form-row uppercase">
            <dl>
              <dt>Action Items</dt>
              <dd>
                <span
                  id="requestInfoActionItems"
                  data-bind="html: request.actionItems"
                ></span>
              </dd>
              <dt>Comments</dt>
              <dd>
                <span
                  id="responseInfoComments"
                  data-bind="html: comments"
                ></span>
              </dd>
            </dl>
          </div>
        </div>

        <div>
          <div id="divCoverSheets" data-bind="visible: currentResponse">
            <fieldset>
              <legend>Cover Sheets/Supplemental Documents</legend>

              <div
                id="divEmptyCoversheetsMsg"
                style="border: 0px !important; font-style: italic"
                data-bind="visible: arrCoverSheets().length <= 0"
              >
                There are 0 cover sheets or supplemental documents
              </div>
              <table
                id="tblCoverSheets"
                class="tablesorter report"
                data-bind="visible: arrCoverSheets().length > 0"
              >
                <thead>
                  <tr valign="top">
                    <th class="sorter-false" nowrap="nowrap">Name</th>
                  </tr>
                </thead>
                <tbody data-bind="foreach: arrCoverSheets">
                  <tr class="coversheet-item">
                    <td class="coversheet-title" title="Click to Download">
                      <a
                        data-bind="attr: { href: 'javascript:void(0)', onclick: link}"
                        ><span data-bind="text: title"></span
                      ></a>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr valign="top">
                    <th nowrap="nowrap">
                      Total:
                      <span
                        id="tblCoverSheetsTotal"
                        data-bind="text: arrCoverSheets().length"
                        >0</span
                      >
                    </th>
                  </tr>
                </tfoot>
              </table>
            </fieldset>
          </div>

          <div
            class="divSubmit"
            data-bind="visible: currentResponse && showSubmit"
          >
            <fieldset style="border-color: GreenYellow">
              <legend style="font-weight: bold; font-size: 11pt">
                SUBMIT RESPONSE
              </legend>
              <div style="padding-top: 15px; padding-bottom: 15px">
                <span class="ui-icon ui-icon-disk"></span
                ><a
                  class="btnSubmitPackage"
                  href="javascript:void(0)"
                  title="Click to Submit the Response Package"
                  data-bind="click: ClickSubmitResponse"
                  >Submit this Response Package</a
                >
              </div>
            </fieldset>
          </div>

          <div id="divResponseDocs" data-bind="visible: currentResponse">
            <fieldset>
              <legend>Response Documents</legend>

              <table
                id="tblResponseDocs"
                class="tablesorter report"
                data-bind="visible: cntResponseDocs() > 0"
              >
                <thead>
                  <tr valign="top">
                    <th class="sorter-false" nowrap="nowrap">Type</th>
                    <th class="sorter-false" nowrap="nowrap">Name</th>
                    <th class="sorter-false" nowrap="nowrap">Title</th>
                    <th class="sorter-false" nowrap="nowrap">Receipt Date</th>
                    <th class="sorter-false" nowrap="nowrap">File Size</th>
                    <th class="sorter-false" nowrap="nowrap">Modified</th>
                    <th class="sorter-false" nowrap="nowrap">Modified By</th>
                  </tr>
                </thead>
                <tbody data-bind="with: arrResponseDocs">
                  <tr class="requestInfo-response-doc">
                    <td colspan="10">
                      <img
                        style="background-color: transparent"
                        src="/_layouts/images/minus.gif"
                        title="Expand/Collapse"
                        data-bind="toggleClick: $data, toggleClass: 'collapsed', containerType: 'doc', classContainer: '.requestInfo-response-doc'"
                      /><span data-bind="text: responseTitle"></span>
                    </td>
                  </tr>

                  <!-- ko foreach: responseDocs-->

                  <tr
                    class="requestInfo-response-doc-item"
                    data-bind="style: styleTag"
                  >
                    <td>
                      <img
                        data-bind="attr:{ src: $parent.siteUrl + '/_layouts/images/' + docIcon}"
                      />
                    </td>
                    <td
                      class="requestInfo-response-doc-title"
                      title="Click to Download"
                    >
                      <a
                        data-bind="downloadLink: '../_layouts/download.aspx?SourceUrl=:folder/:fileName'"
                        ><span data-bind="text: fileName"></span
                      ></a>
                      <span
                        style="float: right"
                        data-bind="visible: ($parent.responseStatus == '1-Open' || $parent.responseStatus == '3-Returned to Action Office') && documentStatus == 'Open'"
                      >
                        <a
                          title="Delete Response Document"
                          href="javascript:void(0)"
                          data-bind="click:  $root.ClickMarkForDeletionResponseDoc"
                          ><span class="ui-icon ui-icon-trash"
                            >Delete Response Document</span
                          ></a
                        >
                      </span>
                    </td>
                    <td nowrap data-bind="text: title"></td>
                    <td nowrap data-bind="text: receiptDate"></td>
                    <td nowrap data-bind="text: fileSize"></td>
                    <td
                      class="requestInfo-response-doc-modified"
                      data-bind="text: modifiedDate"
                    ></td>
                    <td
                      class="requestInfo-response-doc-modifiedBy"
                      data-bind="text: modifiedBy"
                    ></td>
                  </tr>

                  <!-- /ko -->
                </tbody>
                <tfoot>
                  <tr valign="top">
                    <th colspan="7" nowrap="nowrap">
                      Total:
                      <span
                        id="tblResponseDocsTotal"
                        data-bind="text: cntResponseDocs"
                        >0</span
                      >
                    </th>
                  </tr>
                </tfoot>
              </table>
              <div class="divUpload" data-bind="visible: showUpload()">
                <label class="file-upload-field">
                  Upload Response Documents:
                  <div class="dropzone" data-bind="">Drop Files Here</div>
                  <input
                    class="file-upload"
                    type="file"
                    multiple
                    data-bind="files: responseDocFiles"
                  />
                </label>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  <\/script>

  <div id="divTest"></div>
`])));var Hs={};window.history.replaceState({},"",document.location.href);function Zt(t,e){if(nn(t)==e)return;let s=window.location.search,o=new RegExp("([?;&])"+t+"[^&;]*[;&]?"),u=s.replace(o,"$1").replace(/&$/,""),h=(u.length>2?u+"&":"?")+(e?t+"="+e:"");Hs[t]=e,window.history.pushState(Hs,"",h.toString())}function nn(t){let e=new RegExp("[?&]"+t+"=([^&#]*)").exec(window.location.href);return e==null?null:decodeURI(e[1])||0}var es=class{constructor(e,s="Tab"){this.urlParam=s,ko.utils.arrayPushAll(this.tabOpts,e),this.selectedTab.subscribe(this.tabChangeHandler),window.addEventListener("popstate",this.popStateHandler)}tabOpts=ko.observableArray();selectedTab=ko.observable();isSelected=e=>e.id==this.selectedTab()?.id;clickTabLink=e=>{this.selectedTab(e),console.log("selected: "+e.id)};selectTab=e=>this.selectById(e.id);selectById=e=>{let s=this.tabOpts().find(o=>o.id==e)??this.getDefaultTab();this.selectedTab(s)};getDefaultTab=()=>this.tabOpts()[0];tabChangeHandler=e=>{e&&Zt(this.urlParam,e.id)};popStateHandler=e=>{e.state&&e.state[this.urlParam]&&this.selectById(e.state[this.urlParam])}},Ft=class{constructor(e,s,o){this.id=e,this.linkText=s,this.template=o}};Ce();Ee();Ce();Ce();Ee();et();Ce();ot();Ie();tt();var ze={pending:"Pending",aging:"Aging",completed:"Completed"},vs=class{constructor({msg:e,blocking:s}){this.msg=e,this.blocking=s,this.Status(ze.pending)}msg;blocking;Status=ko.observable();timeout=window.setTimeout(()=>{console.warn("this task is aging:",this),this.Status(ze.aging)},5e3);markComplete=()=>{window.clearTimeout(this.timeout),this.Status(ze.completed)};IsBlocking=ko.pureComputed(()=>this.blocking&&this.Status()!=ze.completed)},Jt=class t{constructor({msg:e,blocking:s}){this.msg=e,this.blocking=s,this.Status(ze.pending)}msg;blocking;Status=ko.observable();updateProgress=({percentDone:e})=>{this.Status(`${parseInt(e*100)}%`)};setTimeout=()=>window.setTimeout(()=>{console.warn("this task is aging:",this),this.Status(`${this.Status()} (${ze.aging})`)},5e4);resetTimeout=()=>{window.clearTimeout(this.timeout),this.timeout=this.setTimeout()};timeout=this.setTimeout();markComplete=()=>{window.clearTimeout(this.timeout),this.Status(ze.completed)};IsBlocking=ko.pureComputed(()=>this.blocking&&this.Status()!=ze.completed);static Create(e){return new t(e)}};var Kt=ko.observableArray(),Hi=ko.pureComputed(()=>Kt().filter(t=>t.IsBlocking())??[]),gt=class{constructor(e,s=!1,o=null){this.msg=e,this.blocking=s,this.type=o}msg;blocking;type},zt={init:{msg:"Initializing the Application",blocking:!0},save:{msg:"Saving Request",blocking:!0},newRequest:{msg:"Processing New Request",blocking:!0},cancelAction:{msg:"Cancelling Action",blocking:!0},view:{msg:"Viewing Request",blocking:!1},refresh:{msg:"Refreshing Request",blocking:!1},permissionsRequest:{msg:"Updating Request Item Permissions",blocking:!0},permissionsResponse:t=>({msg:"Updating Response Item Permissions: "+t,blocking:!0}),permissionsResponseFolder:t=>({msg:"Updating Response Folder Item Permissions: "+t,blocking:!0}),permissionsResponseAndFolder:t=>({msg:"Updating Response and Folder Item Permissions: "+t,blocking:!0}),permissionsEmailFolder:{msg:"Updating Email Folder Permissions",blocking:!0},permissionsCoversheet:t=>({msg:"Updating Coversheet Permissions: "+t,blocking:!0}),ensurePagePermissions:t=>new gt("Ensuring Page Permissions: "+t),resetPagePermissions:t=>new gt("Resetting Page Permissions: "+t,!0),ensureListPermissions:t=>new gt("Ensuring List Permissions: "+t.ListDef.title),resetListPermissions:t=>new gt("Resetting List Permissions: "+t.ListDef.title,!0),deleteEmailFolder:{msg:"Deleting Email Folder",blocking:!0},newResponse:t=>({msg:"Submitting new Response: "+t,blocking:!0}),updateResponse:t=>({msg:"Updating Response: "+t,blocking:!0}),deleteResponse:t=>({msg:"Deleting Response: "+t,blocking:!0}),closeResponse:t=>({msg:"Closing Response: "+t,blocking:!0}),uploadResponseDoc:t=>({msg:"Uploading Response Document: "+t,blocking:!0,type:Jt}),updateResponseDoc:t=>({msg:"Updating Response Document: "+t,blocking:!0}),approveResponseDoc:t=>({msg:"Approving Response Document: "+t,blocking:!0}),deleteResponseDocFolder:t=>({msg:"Deleting Response Document Folder: "+t,blocking:!0}),uploadCoversheet:t=>({msg:"Uploading Coversheet: "+t,blocking:!0,type:Jt}),updateCoversheet:t=>({msg:"Updating Coversheet: "+t,blocking:!0}),deleteCoversheet:t=>({msg:"Deleting Coversheet: "+t,blocking:!0}),deleteRequestInternalItem:{msg:"Deleting Request Internal Item",blocking:!0},newComment:{msg:"Submitting Comment",blocking:!1},refreshComments:{msg:"Refreshing Comments",blocking:!1},notifyComment:{msg:"Sending Comment Email",blocking:!1},removeComment:{msg:"Removing Comment",blocking:!1},newAction:{msg:"Submitting Action",blocking:!1},refreshActions:{msg:"Refreshing Actions",blocking:!1},newAttachment:{msg:"Submitting Attachment",blocking:!1},refreshAttachments:{msg:"Refreshing Attachments",blocking:!1},approve:{msg:"Approving Request",blocking:!0},lock:{msg:"Locking Request",blocking:!0},closing:{msg:"Closing Request",blocking:!0}},Yt=t=>{let e;return t.type?e=t.type.Create(t):e=new vs(t),Kt.push(e),e},Xt=function(t){t&&(t.markComplete(),window.setTimeout(()=>kn(t),3e3))},kn=function(t){Kt.remove(t)};tt();Ie();_s();Ce();tt();Ie();Ee();et();Ce();tt();Ie();et();Ee();ot();Ee();Ce();Ie();Ie();var Ji=os`
  <dialog
    id=""
    class="card bg-dark draggable modal-dialog"
    data-bind="attr: {id: getUniqueId() }"
  >
    <!-- Can't use 'with: currentDialog' since we need to register our 
      javascript event listeners for grabbing and resizing -->
    <div class="card-header bg-dark grabber">
      <h2 class="card-title" data-bind="text: title"></h2>
      <h2 class="card-title">
        <i class="fa-solid fa-xmark pointer" data-bind="click: clickClose"></i>
      </h2>
    </div>
    <div class="dimmer" data-bind="css: {'active': form.saving }">
      <span class="loader"></span>
      <ul class="" data-bind="foreach: $root.blockingTasks">
        <li data-bind="text: msg + '...'"></li>
      </ul>
    </div>
    <div
      class="card-body"
      data-bind="component: { name: form.componentName, params: form.params }"
    ></div>
    <div class="card-actions">
      <button
        style
        type="button"
        class="btn btn-danger"
        data-bind="click: clickClose"
      >
        Cancel
      </button>
    </div>
  </dialog>
`;var Fn="modal-dialog-component",Pn=ko.observableArray(),_n;var Es=class{constructor(e){if(this.dialogOpts=e,this.title=e.title,this.dialogReturnValueCallback=e.dialogReturnValueCallback,this.form=e.form,this.form?.onComplete){alert("Pass the form onComplete to the modal dialog!");return}this.form.onComplete=this.close.bind(this),_n=this.toggle}toggle=(e=null)=>{e==null&&(e=!this.dlgElement.hasAttribute("open")),e?this.showModal():this.hide()};showModal=()=>{this.dlgElement.showModal(),this.dlgElement.classList.add("active")};clickClose=()=>{this.close(!1)};hide=()=>{this.dlgElement.close(),this.dlgElement.classList.remove("active")};close(e){this.dlgElement.close(),this.dlgElement.classList.remove("active"),this.dialogReturnValueCallback&&this.dialogReturnValueCallback(e),Pn.remove(this.dialogOpts)}_id;getUniqueId=()=>(this._id||(this._id="field-"+Math.floor(Math.random()*1e4)),this._id);koDescendantsComplete=function(e){this.dlgElement=e.querySelector("dialog"),En(this.dlgElement),Nn(this.dlgElement),this.showModal()}};rs(Fn,{template:Ji,viewModel:Es});function Nn(t){t.style.width="550px",t.style.height="",t.style.top="125px",t.style.left=(window.GetViewportWidth()-550)/2+"px"}function En(t){var e=0,s=0,o=0,u=0;let h=t.querySelector(".grabber");h?h.onmousedown=w:t.onmousedown=w;function w(U){U=U||window.event,U.preventDefault(),o=U.clientX,u=U.clientY,document.onmouseup=P,document.onmousemove=N}function N(U){U=U||window.event,U.preventDefault(),e=o-U.clientX,s=u-U.clientY,o=U.clientX,u=U.clientY,t.style.top=t.offsetTop-s+"px",t.style.left=t.offsetLeft-e+"px"}function P(){document.onmouseup=null,document.onmousemove=null}}async function Ki(t,e){let s=Yt(zt.uploadResponseDoc(e.name)),o={Title:e.name,ReqNumId:t.ReqNum.Value().ID,ResIDId:t.ID};await z.AuditResponseDocs.UploadFileToFolderAndUpdateMetadata(e,e.name,t.Title.Value(),o,({currentBlock:u,totalBlocks:h})=>s.updateProgress({percentDone:u/h})),Xt(s)}tt();Cs();var V=window.Audit||{};V.AOReport=V.AOReport||{};var On="ResNum";V.AOReport.Init=function(){var t=GetUrlKeyValue("ShowSiteActions");t!=!0&&($("#RibbonContainer-TabRowLeft").hide(),$(".ms-siteactionsmenu").hide());function e(){var s=setInterval(function(){var o=$("#divCounter").text(),u=o*1-1;$("#divCounter").text(u),u<=0&&(V.AOReport.Report.IsTransactionExecuting()?(clearInterval(s),$("#divCounter").text("1200"),e()):V.Common.Utilities.Refresh())},1e3)}e()};V.AOReport.NewReportPage=function(){var t=new Object,e=new Array,s=new Array,o=new Array,u=null,h=null,w,N,P=null,U=null,B=null,j=null,ee=null,ae=null,ie=null,le="",ue=!1,de=!1,ne="1-Open",Te="3-Returned to Action Office";function ht(){var l=this;l.debugMode=ko.observable(!1),l.siteUrl=V.Common.Utilities.GetSiteUrl(),l.tabOpts={Responses:new Ft("response-report","Status Report",{id:"responseStatusReportTemplate",data:l}),ResponseDetail:new Ft("response-detail","Responses",{id:"responseDetailTemplate",data:l})},l.tabs=new es(Object.values(l.tabOpts)),l.runningTasks=Kt,l.blockingTasks=Hi,l.arrResponses=ko.observableArray(null),l.arrFilteredResponsesCount=ko.observable(0),l.cntPendingReview=ko.observable(0),l.ddOptionsResponseTabRequestID=ko.observableArray(),l.ddOptionsResponseTabRequestStatus=ko.observableArray(),l.ddOptionsResponseTabRequestInternalDueDate=ko.observableArray(),l.ddOptionsResponseTabRequestSample=ko.observableArray(),l.ddOptionsResponseTabResponseTitle=ko.observableArray(),l.ddOptionsResponseTabResponseStatus=ko.observableArray(),l.filterResponseTabRequestIntDueDate=ko.observable(),l.filterResponseTabResponseName=ko.observable(),l.filterResponseTabResponseStatus=ko.observable(),l.doSort=ko.observable(!1),l.ddOptionsResponseInfoTabResponseNameOpen2=ko.observableArray(),l.ddOptionsResponseInfoTabResponseNameProcessed2=ko.observableArray(),l.filterResponseInfoTabResponseNameOpen2=ko.observable(""),l.filterResponseInfoTabResponseNameProcessed2=ko.observable(""),l.currentResponse=ko.observable(),l.arrCoverSheets=ko.observableArray(null),l.arrResponseDocs=ko.observable(null),l.cntResponseDocs=ko.observable(0),l.responseDocFiles=ko.observableArray(),l.showUpload=ko.observable(!1),l.showSubmit=ko.observable(!1),l.refresh=()=>window.location.reload(),l.onNewResponseDocCallback=l.refresh,l.currentResponse.subscribe(f=>{f&&Zt(On,f.title)}),l.selectedFiltersResponseTab=ko.computed(function(){var f=l.filterResponseTabRequestIntDueDate(),R=l.filterResponseTabResponseName(),I=l.filterResponseTabResponseStatus();return f+" "+R+" "+I}),l.ClearFiltersResponseTab=function(){l.filterResponseTabRequestIntDueDate(""),l.filterResponseTabResponseName(""),l.filterResponseTabResponseStatus("")},l.FilterChangedResponseTab=function(){document.body.style.cursor="wait",setTimeout(function(){var f=l.filterResponseTabRequestIntDueDate(),R=l.filterResponseTabResponseName(),I=l.filterResponseTabResponseStatus();if(!f&&!R&&!I){$(".sr-response-item").show(),l.arrFilteredResponsesCount(l.arrResponses().length),document.body.style.cursor="default";return}f=f||"",R=R||"",I=I||"";var x=0,M=$(".sr-response-item");M.each(function(){var G=!1;!G&&f!=""&&$.trim($(this).find(".sr-response-internalDueDate").text())!=f&&(G=!0),!G&&R!=""&&$.trim($(this).find(".sr-response-title").text())!=R&&(G=!0),!G&&I!=""&&$.trim($(this).find(".sr-response-status").text())!=I&&(G=!0),G?$(this).hide():($(this).show(),x++)}),l.arrFilteredResponsesCount(x),document.body.style.cursor="default"},100)},l.ClickSubmitResponse=function(){At()},l.ClickUploadResponseDoc=function(){var f=l.currentResponse();f&&f.number&&f.title&&St(f.number,f.title)},l.ClickMarkForDeletionResponseDoc=function(f){f&&f.ID&&Dt(f.ID)},l.selectedFiltersResponseTab.subscribe(function(f){l.FilterChangedResponseTab()}),l.doSort.subscribe(function(f){V.Common.Utilities.OnLoadDisplayTimeStamp(),l.arrResponses().length>0&&f&&(l.arrFilteredResponsesCount(l.arrResponses().length),ko.utils.arrayPushAll(l.ddOptionsResponseTabResponseStatus(),l.GetDDVals("status")),l.ddOptionsResponseTabResponseStatus.valueHasMutated(),ko.utils.arrayPushAll(l.ddOptionsResponseInfoTabResponseNameOpen2(),l.GetDDVals2("1",!0)),l.ddOptionsResponseInfoTabResponseNameOpen2.valueHasMutated(),ko.utils.arrayPushAll(l.ddOptionsResponseInfoTabResponseNameProcessed2(),l.GetDDVals2("0",!0)),l.ddOptionsResponseInfoTabResponseNameProcessed2.valueHasMutated(),ko.utils.arrayPushAll(l.ddOptionsResponseTabRequestInternalDueDate(),l.GetDDVals("internalDueDate")),l.ddOptionsResponseTabRequestInternalDueDate.valueHasMutated(),ko.utils.arrayPushAll(l.ddOptionsResponseTabResponseTitle(),l.GetDDVals("title",!0)),l.ddOptionsResponseTabResponseTitle.valueHasMutated(),setTimeout(function(){var R=GetUrlKeyValue("Tab");R!=null&&R!=""?l.tabs.selectById(R):l.tabs.selectById(l.tabOpts.Responses.id),(R==null||R==""||R==0)&&l.cntPendingReview()>0&&SP.UI.Notify.addNotification("<div style='text-align:left'>There are <b>"+l.cntPendingReview()+"</b> Responses pending your review/action. <br/> <br/> Please click on the links in the <b>Response Name</b> column of the <b>Status Report tab</b> <br/> to access each response and upload documents and submit the package.</div>",!1);var I=GetUrlKeyValue("ResNum");I!=null&&I!=""&&(R==0?$("#ddlResponseName option[value='"+I+"']").length>0&&Y.filterResponseTabResponseName(I):$("#ddlResponsesOpen option[value='"+I+"']").length>0?Y.filterResponseInfoTabResponseNameOpen2(I):$("#ddlResponsesProcessed option[value='"+I+"']").length>0&&Y.filterResponseInfoTabResponseNameProcessed2(I)),Ye(),l.filterResponseTabResponseStatus(le),$("#tblStatusReportResponses").tablesorter({sortList:[[2,0]],selectorHeaders:".sorter-true"})},200))}),l.filterResponseInfoTabResponseNameOpen2.subscribe(function(f){l.filterResponseInfoTabResponseName(f,!0)}),l.filterResponseInfoTabResponseNameProcessed2.subscribe(function(f){l.filterResponseInfoTabResponseName(f,!1)}),l.filterResponseInfoTabResponseName=function(f,R){l.currentResponse(null),l.arrCoverSheets([]),l.arrResponseDocs(null),l.cntResponseDocs(0),ue=!1;var I=t["response-"+f];I&&(R?l.filterResponseInfoTabResponseNameProcessed2(""):l.filterResponseInfoTabResponseNameOpen2(""),l.currentResponse(I),Ge(I),wt(I),R&&(ue=!0))},l.responseDocFiles.subscribe(async function(f){if(!f.length)return;let R=l.currentResponse()?.ID;if(!R)return;let I=await z.AuditResponses.FindById(R),x=[];for(let M of f)x.push(new Promise(async G=>{let q=await Ki(I,M);G()}));await Promise.all(x),l.responseDocFiles.removeAll(),l.onNewResponseDocCallback()}),l.GetDDVals=function(f,R){var I=ko.utils.arrayMap(l.arrResponses(),function(M){return M[f]}),x=ko.utils.arrayGetDistinctValues(I).sort();return R&&x.sort(V.Common.Utilities.SortResponseTitles),x[0]==""&&x.shift(),x},l.GetDDVals2=function(f,R){var I=ko.utils.arrayMap(l.arrResponses(),function(M){var G=M.requestStatus,q=M.status;if(f==0)return q!=ne&&q!=Te?M.title:"";if(f==1)return(q==ne||q==Te)&&(G=="Open"||G=="ReOpened")?M.title:""}),x=ko.utils.arrayGetDistinctValues(I).sort();return R&&x.sort(V.Common.Utilities.SortResponseTitles),x[0]==""&&x.shift(),x}}var Y=new ht;ko.applyBindings(Y),st();function st(){var l=new SP.ClientContext.get_current,f=l.get_web();let R=f.get_currentUser();l.load(R);var I=f.get_lists().getByTitle(V.Common.Utilities.GetListTitleRequests()),x=new SP.CamlQuery;x.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'),B=I.getItems(x),l.load(B,"Include(ID, Title, ReqSubject, ReqStatus, InternalDueDate, ActionOffice, RelatedAudit, ActionItems, Comments, EmailSent, ClosedDate)");var M=f.get_lists().getByTitle(V.Common.Utilities.GetListTitleResponses()),G=new SP.CamlQuery;G.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="ReqNum"/></OrderBy></Query></View>'),j=M.getItems(G),l.load(j,"Include(ID, Title, ReqNum, ActionOffice, ReturnReason, SampleNumber, ResStatus, Comments, Modified, ClosedDate, ClosedBy, POC)");var q=f.get_lists().getByTitle(V.Common.Utilities.GetLibTitleResponseDocs()),L=new SP.CamlQuery;L.set_viewXml('<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">0</Value></Eq></Where></Query></View>'),ee=q.getItems(L),l.load(ee,"Include(ID, Title, ReqNum, ResID, DocumentStatus, ReceiptDate, FileLeafRef, FileDirRef, File_x0020_Size, Modified, Editor)");var W=f.get_lists().getByTitle(V.Common.Utilities.GetListTitleActionOffices()),H=new SP.CamlQuery;H.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>'),ae=W.getItems(H),l.load(ae,"Include(ID, Title, UserGroup)"),ie=l.get_web().get_lists().getByTitle(V.Common.Utilities.GetLibTitleResponseDocs()),l.load(ie,"Title","Id"),w=f.get_associatedOwnerGroup(),N=f.get_associatedMemberGroup(),P=f.get_associatedVisitorGroup(),l.load(w),l.load(N),l.load(P),U=f.get_siteGroups(),l.load(U),l.executeQueryAsync(pe,oe);function pe(J,te){$("#divRefresh").show(),Rt()}function oe(J,te){$("#divRefresh").hide(),$("#divLoading").hide();let ce=SP.UI.Status.addStatus("Request failed: "+te.get_message()+`
`+te.get_stackTrace());SP.UI.Status.setStatusPriColor(ce,"red")}}function Rt(){if(V.Common.Utilities.LoadSiteGroups(U),vt(),V.Common.Utilities.LoadActionOffices(ae),N!=null&&(u=N.get_title()),u==null||u==""){let l=SP.UI.Status.addStatus("Unable to retrieve the IA SharePoint Group. Please contact the Administrator");SP.UI.Status.setStatusPriColor(l,"red");return}h=V.Common.Utilities.GetActionOffices()?.find(l=>l.userGroup==u),yt(),ke(),it(),Ve(s,"fbody")}function vt(){V.Common.Utilities.SetResponseDocLibGUID(ie.get_id())}function yt(){t=new Object,e=new Array;for(var l=0,f=B.getEnumerator();f.moveNext();){var R=f.get_current(),I=R.get_item("EmailSent");if(I){var x=R.get_item("ID"),M=R.get_item("Title"),G=R.get_item("ReqStatus"),q=R.get_item("ReqSubject");q==null&&(q="");for(var L=R.get_item("ActionOffice"),W="",H=0;H<L.length;H++)W+="<div>"+L[H].get_lookupValue()+"</div>";var pe=R.get_item("Comments"),oe=R.get_item("RelatedAudit"),J=R.get_item("ActionItems");pe==null&&(pe=""),oe==null&&(oe=""),J==null&&(J="");var te=R.get_item("InternalDueDate"),ce=R.get_item("ClosedDate");te!=null?te=te.format("MM/dd/yyyy"):te="",ce!=null?ce=ce.format("MM/dd/yyyy"):ce="";var a=new Object;a.ID=x,a.number=M,a.subject=q,a.status=G,a.internalDueDate=te,a.actionOffice=W,a.comments=pe,a.relatedAudit=oe,a.actionItems=J,a.emailSent=I,a.closedDate=ce,a.responses=new Array,a.arrIndex=l,e.push(a),t["request-"+M]=a,l++}}}function ke(){s=new Array;for(var l=0,f=j.getEnumerator();f.moveNext();){var R=f.get_current(),I=R.get_item("ReqNum");if(I!=null){I=I.get_lookupValue();var x=new Object;if(x.request=t["request-"+I],!x.request||!x.request.emailSent||(x.actionOffice=R.get_item("ActionOffice"),x.actionOffice==null?x.actionOffice="":x.actionOffice=x.actionOffice.get_lookupValue(),x.actionOffice==""))continue;x.poc=R.get_item("POC"),x.poc==null?x.poc="":x.poc=x.poc.get_lookupValue(),x.ID=R.get_item("ID"),x.number=I;var M=R.get_item("Title");x.title=M,x.resStatus=R.get_item("ResStatus"),(x.request.status=="Closed"||x.request.status=="Canceled")&&(x.resStatus="7-Closed");var G=R.get_item("Modified"),q=R.get_item("ClosedDate");G!=null?G=G.format("MM/dd/yyyy hh:mm tt"):G="",q!=null?q=q.format("MM/dd/yyyy"):q="",x.modified=G,x.closedDate=q,x.closedBy=V.Common.Utilities.GetFriendlyDisplayName(R,"ClosedBy"),x.sample=R.get_item("SampleNumber"),x.sample==null&&(x.sample="");var L=R.get_item("Comments");L==null&&(L=""),x.comments=L;var W=R.get_item("ReturnReason");W==null&&(W=""),x.returnReason=W,x.responseDocs=new Array,x.coversheets=new Array,x.arrIndex=l,s.push(x),t["response-"+M]=x,l++}}}function it(){for(var l=ee.getEnumerator();l.moveNext();){var f=l.get_current();let pe=f.get_item("ID");var R=f.get_item("ReqNum");R!=null&&(R=R.get_lookupValue());var I=f.get_item("ResID");if(I!=null&&(I=I.get_lookupValue()),!(R==null||I==null)&&f.get_item("DocumentStatus")!="Marked for Deletion")try{var x=t["response-"+I],M=x.arrIndex,G=s[M];if(G){var q=new Object;q.ID=f.get_item("ID"),q.title=f.get_item("Title"),q.title==null&&(q.title=""),q.fileName=f.get_item("FileLeafRef"),q.folder=f.get_item("FileDirRef"),q.documentStatus=f.get_item("DocumentStatus");var L=f.get_item("File_x0020_Size");L=V.Common.Utilities.GetFriendlyFileSize(L),q.fileSize=L;var W="";f.get_item("ReceiptDate")!=null&&f.get_item("ReceiptDate")!=""&&(W=f.get_item("ReceiptDate").format("MM/dd/yyyy")),q.receiptDate=W;var H="";f.get_item("Modified")!=null&&f.get_item("Modified")!=""&&(H=f.get_item("Modified").format("MM/dd/yyyy hh:mm tt")),q.modifiedDate=H,q.modifiedBy=V.Common.Utilities.GetFriendlyDisplayName(f,"Editor"),G.responseDocs.push(q)}}catch{}}}function Ve(l,f){if(l!=null){for(var R=new Array,I=new Array,x=new Array,M=new Array,G=0,q=0,L=0,W=l.length;W--;){var H=l[W],pe=H.title,oe=!1,J=H.resStatus;(J==ne||J==Te)&&(G++,J==ne?q++:L++,oe=!0);var te={title:pe,requestSubject:H.request.subject,requestStatus:H.request.status,internalDueDate:H.request.internalDueDate,status:J,docCount:H.responseDocs.length,modified:H.modified,highlight:oe,visibleRow:ko.observable(!0)};R.push(te)}R.length>0&&(le="",q>0&&L==0?le=ne:L>0&&q==0&&(le=Te),Y.cntPendingReview(G),ko.utils.arrayPushAll(Y.arrResponses,R)),Y.doSort(!0)}}function Ge(l){Y.arrCoverSheets([]);var f=new SP.ClientContext.get_current,R=f.get_web(),I=R.get_lists().getByTitle(V.Common.Utilities.GetLibTitleCoverSheets()),x=new SP.CamlQuery;x.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">'+l.request.number+"</Value></Eq></Where></Query></View>");let M=I.getItems(x);f.load(M,"Include(ID, Title, ReqNum, ActionOffice, FileLeafRef, FileDirRef)");var G={oResponse:l};function q(W,H){for(var pe=new Array,oe=M.getEnumerator();oe.moveNext();){var J=oe.get_current();if(J.get_item("ActionOffice")!=null){var te=J.get_item("ActionOffice");if(te.length>0)for(var ce=0;ce<te.length;ce++){var a=te[ce].get_lookupValue();if(a==this.oResponse.actionOffice){var c=J.get_item("FileDirRef"),p=J.get_item("FileLeafRef"),m=p.replace(/'/g,"&#39");pe.push({folder:c,title:p,link:"STSNavigate('../_layouts/download.aspx?SourceUrl="+c+"/"+m+"')"});break}}}}ko.utils.arrayPushAll(Y.arrCoverSheets(),pe),Y.arrCoverSheets.valueHasMutated()}function L(W,H){}f.executeQueryAsync(Function.createDelegate(G,q),Function.createDelegate(G,L))}function wt(l){Y.arrResponseDocs(null),Y.cntResponseDocs(0),Y.showUpload(!1),Y.showSubmit(!1);for(var f=new SP.ClientContext.get_current,R=f.get_web(),I=0;I<l.responseDocs.length;I++){var x=l.responseDocs[I];x.docIcon=R.mapToIcon(x.fileName,"",SP.Utilities.IconSize.Size16)}function M(L,W){q(l)}function G(L,W){let H=SP.UI.Status.addStatus("Request failed: "+W.get_message()+`
`+W.get_stackTrace());SP.UI.Status.setStatusPriColor(H,"red")}f.executeQueryAsync(M,G);function q(L){for(var W=0,H=0,pe=new Array,oe=0;oe<L.responseDocs.length;oe++){var J=L.responseDocs[oe];J.docIcon=J.docIcon.get_value(),J.styleTag=V.Common.Utilities.GetResponseDocStyleTag2(J.documentStatus),J.responseTitle=L.title,J.documentStatus=="Open"&&(L.resStatus==ne||L.resStatus==Te)&&H++,pe.push(J)}ue&&(Y.showUpload(!0),H>0&&Y.showSubmit(!0));var te={responseTitle:L.title,responseDocs:pe,responseStatus:L.resStatus};if(Y.arrResponseDocs(te),Y.arrResponseDocs.valueHasMutated(),Y.cntResponseDocs(L.responseDocs.length),L.resStatus==Te&&L.returnReason!=null&&L.returnReason!=""&&ue&&H==0){var ce=SP.UI.ModalDialog.showWaitScreenWithNoClose("Notice - Response Needs to be Updated","<span style=''><span class='ui-icon ui-icon-alert'></span>Response Return Reason: <span style='font-weight:bold; color:red;'>"+L.returnReason+"</span></span>",100,500);setTimeout(function(){ce.close()},5e3)}if(L.resStatus=="1-Open"||L.resStatus=="3-Returned to Action Office"){if(ue&&H>0){let c=function(){$(".btnSubmitPackage").parent().css({"background-color":"inherit","font-weight":"inherit"})},a=SP.UI.Notify.addNotification("<div style='text-align:left'>Response documents have been added. <br/><br/>Your package <span style='font-weight:bold; color:red'>has not yet been submitted</span>. <br></br>Please review your documents and click on the link <b>SUBMIT this Response Package</b> below</div>",!1);$(".btnSubmitPackage").parent().css({"background-color":"yellow","font-weight":"inherit"}),$(".btnSubmitPackage").get(0).scrollIntoView(),setTimeout(function(){c()},2e3)}else if(ue&&H==0){let a=SP.UI.Notify.addNotification("<div style='text-align:left'>Please review the Response Information and any CoverSheets/Supplemental Documents. <br/><br/>Then, click the link to <span style='font-weight:bold; color:gree'>Upload Response Documents</span> pertaining to this Response</div>",!1)}}}}function bt(l,f){var R="<div>Audit Request Reference: <b>{REQUEST_NUMBER}</b></div><div>Audit Request Subject: <b>{REQUEST_SUBJECT}</b></div><div>Audit Request Due Date: <b>{REQUEST_DUEDATE}</b></div><br/><div>Below is the Response that was submitted: </div><div>{RESPONSE_TITLE}</div>";R=R.replace("{REQUEST_NUMBER}",l.number),R=R.replace("{REQUEST_SUBJECT}",l.subject),R=R.replace("{REQUEST_DUEDATE}",l.internalDueDate);var I="<ul><li>"+f+"</li></ul>";return R=R.replace("{RESPONSE_TITLE}",I),R}function St(l,f){de=!0;var R=SP.UI.ModalDialog.showWaitScreenWithNoClose("Loading...","<span style='font-size:11pt'><span class='ui-icon ui-icon-info'></span>If you are uploading <span style='font-weight:bold; color:green;text-decoration:underline'>multiple</span> documents, please <span style='font-weight:bold; color:green;text-decoration:underline'>zip </span> them.</span>",100,600);setTimeout(function(){R.close();var I=SP.UI.$create_DialogOptions();I.title="Upload Response Document to: "+f,I.dialogReturnValueCallback=Ct;var x=V.Common.Utilities.GetSiteUrl()+"/"+V.Common.Utilities.GetLibNameResponseDocs()+"/"+f;I.url=V.Common.Utilities.GetSiteUrl()+"/_layouts/Upload.aspx?List={"+V.Common.Utilities.GetResponseDocLibGUID()+"}&RootFolder="+x+"&ReqNum="+l+"&ResID="+f,SP.UI.ModalDialog.showModalDialog(I)},3e3)}function Ct(l,f){l===SP.UI.DialogResult.OK?V.Common.Utilities.Refresh():de=!1}function At(){var l=$("#ddlResponsesOpen").val();if(confirm("Are you sure you would like to submit these response documents? Note: You will NOT be able to make changes or upload any more documents after you submit this package.")){let pe=function(J,te){var ce=0;if(W!=null)for(var a=W.getEnumerator();a.moveNext();){var c=a.get_current();c.set_item("DocumentStatus","Submitted"),c.update(),ce++}if(ce==0){let A=SP.UI.Notify.addNotification("Please upload a Response document.",!1);L.close();return}var p=null;try{var m=t["response-"+l],v=m.arrIndex;let A=s[v];if(A){p=A.request;var b=f.get_web().get_lists().getByTitle(V.Common.Utilities.GetListTitleResponses());let k=b.getItemById(A.ID);k.set_item("ResStatus","2-Submitted"),k.update()}}catch(A){alert(A),V.Common.Utilities.Refresh()}if(p==null){L.close();return}var C="A Response has been Submitted by an Action Office: "+p.number,g=bt(p,l),F=new SP.ListItemCreationInformation;F.set_folderUrl(location.protocol+"//"+location.host+V.Common.Utilities.GetSiteUrl()+"/Lists/"+V.Common.Utilities.GetListNameEmailHistory()+"/"+p.number),c=G.addItem(F),c.set_item("Title",C),c.set_item("Body",g),c.set_item("To",h.title),c.set_item("ReqNum",p.number),c.set_item("ResID",l),c.set_item("NotificationType","IA Notification"),c.update();function T(A,k){document.body.style.cursor="default",L.close(),V.Common.Utilities.Refresh()}function S(A,k){L.close();let n=SP.UI.Status.addStatus("Request failed: "+k.get_message()+`
`+k.get_stackTrace());SP.UI.Status.setStatusPriColor(n,"red")}f.executeQueryAsync(T,S)},oe=function(J,te){L.close();let ce=SP.UI.Status.addStatus("Request failed: "+te.get_message()+`
`+te.get_stackTrace());SP.UI.Status.setStatusPriColor(ce,"red")};de=!0;let L=SP.UI.ModalDialog.showWaitScreenWithNoClose("Submitting Response","Please wait... Submitting Response",200,400);var f=new SP.ClientContext.get_current,R=f.get_web(),I=V.Common.Utilities.GetSiteUrl()+"/"+V.Common.Utilities.GetLibNameResponseDocs()+"/"+l,x=R.get_lists().getByTitle(V.Common.Utilities.GetLibTitleResponseDocs()),M=new SP.CamlQuery;M.set_viewXml(`<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name='FileDirRef'/><Value Type='Text'>`+I+"</Value></Eq><Eq><FieldRef Name='DocumentStatus'/><Value Type='Text'>Open</Value></Eq></And></Where></Query></View>");let W=x.getItems(M);f.load(W,"Include(ID, DocumentStatus, FileDirRef)");var G=R.get_lists().getByTitle(V.Common.Utilities.GetListTitleEmailHistory()),q=new SP.CamlQuery;q.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>');let H=G.getItems(q);f.load(H,"Include(ID, Title, DisplayName)"),f.executeQueryAsync(pe,oe)}}function Dt(l){if(confirm("Are you sure you would like to Delete this Response Document?")){let x=function(G,q){V.Common.Utilities.Refresh()},M=function(G,q){let L=SP.UI.Status.addStatus("Request failed: "+q.get_message()+`
`+q.get_stackTrace());SP.UI.Status.setStatusPriColor(L,"red")};var f=new SP.ClientContext,R=f.get_web().get_lists().getByTitle(V.Common.Utilities.GetLibNameResponseDocs());let I=R.getItemById(l);I.set_item("DocumentStatus","Marked for Deletion"),I.update(),f.executeQueryAsync(x,M)}}function Ye(){xt("#btnPrint1","#divStatusReportRespones","Action Office Response Status Report"),It(".export1","AOResponseStatusReport_","tblStatusReportResponses")}function xt(l,f,R){$(l).on("click",function(){V.Common.Utilities.PrintStatusReport(R,f)})}function It(l,f,R){$(l).on("click",function(I){var x=new Date().format("yyyyMMdd_hhmmtt");V.Common.Utilities.ExportToCsv(f+x,R)})}function Tt(l){if(Y.tabs.selectById(Y.tabOpts.ResponseDetail.id),l){l=t["response-"+l];var f=l.request.status,R=l.resStatus;(R==ne||R==Te)&&(f=="Open"||f=="ReOpened")?Y.filterResponseInfoTabResponseNameOpen2(l.title):Y.filterResponseInfoTabResponseNameProcessed2(l.title)}}var kt={GoToResponse:Tt,IsTransactionExecuting:function(){return de}};return kt};document.readyState==="ready"||document.readyState==="complete"?zi():document.onreadystatechange=()=>{(document.readyState==="complete"||document.readyState==="ready")&&ExecuteOrDelayUntilScriptLoaded(function(){SP.SOD.executeFunc("sp.js","SP.ClientContext",zi)},"sp.js")};function zi(){document.getElementById("app").innerHTML=Qs,V.AOReport.Report=new V.AOReport.NewReportPage,V.AOReport.Init()}})();
//# sourceMappingURL=ao_db.js.map
