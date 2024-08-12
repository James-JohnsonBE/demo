(()=>{var Cn=Object.freeze,Sn=Object.defineProperty;var ee=(t,e)=>()=>(t&&(e=t(t=0)),e);var sa=(t,e)=>{for(var s in e)Sn(t,s,{get:e[s],enumerable:!0})};var An=(t,e)=>Cn(Sn(t,"raw",{value:Cn(e||t.slice())}));var Bs,In=ee(()=>{Bs=(t,e)=>t.Title>e.Title?1:t.Title<e.Title?-1:0});var $e,xi=ee(()=>{$e=class t{constructor({ID:e,Title:s,LoginName:n=null,IsGroup:o=null,IsEnsured:r=!1}){this.ID=e,this.Title=s,this.LookupValue=s,this.LoginName=n!=""?n:null,this.IsGroup=o,this.IsEnsured=r}ID=null;Title=null;LoginName=null;LookupValue=null;getKey=()=>this.LoginName??this.Title;static Create=function(e){return!e||!e.ID&&!(e.Title||e.LookupValue)?null:new t({...e,Title:e.Title??e.LookupValue})}}});var Yt,Ls=ee(()=>{Yt=class{constructor(e,s,n){this.source=e,this.type=s,this.description=n}}});var Xt,Pn=ee(()=>{Xt=class{constructor(e){e?.ID&&(this.ID=e.ID),e?.Title&&(this.Title=e.Title)}ObservableID=ko.observable();ObservableTitle=ko.observable();get id(){return this.ObservableID()}set id(e){this.ObservableID(e)}get Title(){return this.ObservableTitle()}set Title(e){this.ObservableTitle(e)}}});function va(t){return{requirement:ko.pureComputed(()=>{if(!ko.unwrap(t.isRequired))return!1;let s=ko.unwrap(t.Value);return s?.constructor==Array?!s.length:s==null}),error:new Yt("text-field","required-field",`${ko.utils.unwrapObservable(t.displayName)} is required!`)}}var Ie,xn=ee(()=>{Ls();Ie=class{constructor({displayName:e,systemName:s,instructions:n=null,isRequired:o=!1,width:r,classList:a=[],Visible:l=ko.pureComputed(()=>!0)}){this.displayName=e,this.systemName=s,this.instructions=n,this.isRequired=o,this.Visible=l,this.width=r?"col-md-"+r:"col-md-6",this.classList=a,this.addFieldRequirement(va(this))}Value=ko.observable();get=()=>this.Value();set=e=>this.Value(e);clear=()=>{ko.isObservableArray(this.Value)?this.Value([]):this.Value(null)};toString=ko.pureComputed(()=>this.Value());toJSON=()=>this.Value();fromJSON=e=>this.Value(e);validate=(e=!0)=>(this.ShowErrors(e),this.Errors());_fieldValidationRequirements=ko.observableArray();Errors=ko.pureComputed(()=>this.Visible()?this._fieldValidationRequirements().filter(s=>s.requirement()).map(s=>s.error):[]);addFieldRequirement=e=>this._fieldValidationRequirements.push(e);IsValid=ko.pureComputed(()=>!this.Errors().length);ShowErrors=ko.observable(!1);ValidationClass=ko.pureComputed(()=>{if(this.ShowErrors())return this.Errors().length?"is-invalid":"is-valid"})}});function Oe(t){ko.components.register(t.edit,{template:t.editTemplate,viewModel:t}),ko.components.register(t.view,{template:t.viewTemplate,viewModel:t})}var Ce,Pe,ct=ee(()=>{Ce=String.raw;Pe=class{constructor(e){Object.assign(this,e)}_id;getUniqueId=()=>(this._id||(this._id="field-"+Math.floor(Math.random()*1e4)),this._id);Errors=ko.pureComputed(()=>this.ShowErrors()?this.isRequired?this.Value()?[]:[new ValidationError("text-field","required-field",this.displayName+" is required!")]:[]:[]);ShowErrors=ko.observable(!1);ValidationClass=ko.pureComputed(()=>{if(this.ShowErrors())return this.Errors().length?"is-invalid":"is-valid"});static viewTemplate=Ce`
    <div class="fw-semibold" data-bind="text: displayName"></div>
    <div data-bind="text: toString()"></div>
  `;static editTemplate=Ce`<div>Uh oh!</div>`}});var ba,Ra,ms,qn=ee(()=>{ct();ba=Ce`
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
`,Ra=Ce`
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
`,ms=class extends Pe{constructor(e){super(e)}static viewTemplate=Ra;static editTemplate=ba;static view="blob-view";static edit="blob-edit";static new="blob-edit"};Oe(ms)});var ya,wa,ps,En=ee(()=>{ct();ya=Ce`
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
`,wa=Ce`
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
`,ps=class extends Pe{constructor(e){super(e)}static viewTemplate=wa;static editTemplate=ya;static view="checkbox-view";static edit="checkbox-edit";static new="checkbox-edit"};Oe(ps)});var Ca,fs,Fn=ee(()=>{ct();Ca=Ce`
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
`,fs=class extends Pe{constructor(e){super(e)}static editTemplate=Ca;static view="date-view";static edit="date-edit";static new="date-edit"};Oe(fs)});var Sa,gs,Nn=ee(()=>{ct();Sa=Ce`
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
`,gs=class extends Pe{constructor(e){super(e),this.onSearchInput=e.onSearchInput,this.multiple=e.multiple??!1}static editTemplate=Sa;static view="lookup-view";static edit="lookup-edit";static new="lookup-edit"};Oe(gs)});var Aa,Da,hs,qi=ee(()=>{ct();Aa=Ce`
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
`,Da=Ce`
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
`,hs=class extends Pe{constructor(e){super(e)}ValueFunc=ko.pureComputed({read:()=>this.Value()?ko.unwrap(this.userOpts).find(s=>s.ID==this.Value().ID):void 0,write:e=>{ko.unwrap(this.userOpts)&&this.Value(e)}});ShowUserSelect=ko.pureComputed(()=>this.spGroupName?ko.unwrap(this.userOpts).length:!1);static viewTemplate=Da;static editTemplate=Aa;static view="people-view";static edit="people-edit";static new="people-edit"};Oe(hs)});var ka,Ut,On=ee(()=>{ct();ka=Ce`
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
`,Ut=class extends Pe{constructor(e){super(e),this.Options=e.Options,this.Value=e.Value,this.optionsText=e.optionsText??(s=>s),this.multiple=e.multiple,this.OptionsCaption=e.OptionsCaption??"Select...",this.onSearchInput=e.onSearchInput}GetSelectedOptions=ko.pureComputed(()=>this.multiple?this.Value():this.Value()?[this.Value()]:[]);InputGroupFocused=ko.observable();setFocus=()=>this.InputGroupFocused(!0);FilterText=ko.observable();FilteredOptions=ko.pureComputed(()=>this.Options().filter(e=>this.GetSelectedOptions().indexOf(e)>=0?!1:this.FilterText()?this.optionsText(e).toLowerCase().includes(this.FilterText().toLowerCase()):!0));addSelection=(e,s)=>{console.log("selected",e),s.target.nextElementSibling&&s.target.nextElementSibling.focus(),this.multiple?this.Value.push(e):this.Value(e)};removeSelection=e=>this.multiple?this.Value.remove(e):this.Value(null);setInputGroupFocus=()=>{this.InputGroupFocused(!0),clearTimeout(this.focusOutTimeout)};removeInputGroupFocus=(e,s)=>{this.focusOutTimeout=window.setTimeout(()=>{this.InputGroupFocused(!1)},0)};static editTemplate=ka;static view="search-select-view";static edit="search-select-edit";static new="search-select-new"};Oe(Ut)});var _a,vs,Un=ee(()=>{ct();_a=Ce`
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
`,vs=class extends Pe{constructor(e){super(e)}static editTemplate=_a;static view="select-view";static edit="select-edit";static new="select-edit"};Oe(vs)});var Ta,Ia,bs,Vn=ee(()=>{ct();Ta=Ce`
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
`,Ia=Ce`
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
`,bs=class extends Pe{constructor(e){super(e)}childrenHaveLoaded=e=>{this.initializeEditor()};getToolbarId=()=>"toolbar-"+this.getUniqueId();initializeEditor(){let e=[["bold","italic","underline","strike"],["link"],["blockquote","code-block"],[{header:1},{header:2}],[{list:"ordered"},{list:"bullet"}],[{script:"sub"},{script:"super"}],[{indent:"-1"},{indent:"+1"}],[{direction:"rtl"}],[{size:["small",!1,"large","huge"]}],[{header:[1,2,3,4,5,6,!1]}],[{color:[]},{background:[]}],[{font:[]}],[{align:[]}],["clean"]];var s=new Quill("#"+this.getUniqueId(),{modules:{toolbar:e},theme:"snow"});let n=this.Value;n.subscribe(o=>{o==""&&s.setText("")}),s.on("text-change",function(o,r,a){n(s.root.textContent?s.root.innerHTML:"")})}static viewTemplate=Ia;static editTemplate=Ta;static view="text-area-view";static edit="text-area-edit";static new="text-area-edit"};Oe(bs)});var Pa,Rs,Gn=ee(()=>{ct();Pa=Ce`
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
`,Rs=class extends Pe{constructor(e){super(e)}static editTemplate=Pa;static view="text-view";static edit="text-edit";static new="text-edit"};Oe(Rs)});var kt=ee(()=>{ct();qn();En();Fn();Nn();qi();On();Un();Vn();Gn()});var Vt,Bn=ee(()=>{He();kt();Vt=class t extends Ie{constructor(e){super(e),this.entityType=e.entityType,this.multiple=e.multiple,this.multiple&&(this.Value=ko.observableArray()),ko.isObservable(this.entityType)&&this.entityType.subscribe(this.updateEntityTypeHandler),this.updateEntityTypeHandler(ko.unwrap(this.entityType))}toString=ko.pureComputed(()=>`${this.Value()?.length??"0"} items`);toJSON=ko.pureComputed(()=>this.multiple?this.Value().map(e=>e.toJSON()):this.Value()?.toJSON());fromJSON=e=>{if(e){if(!this.multiple){this.Value()?.fromJSON(e);return}this.Value.removeAll(),e.map(s=>{let n=new this.entityConstructor;n.fromJSON(s),this.Value.push(n)})}};get=()=>JSON.stringify(this.toJSON());blob;set=e=>{window.DEBUG&&console.log(e),this.blob=e,e?.constructor!=t&&this.fromJSON(JSON.parse(e))};get entityConstructor(){return ko.utils.unwrapObservable(this.entityType)}Cols=ko.pureComputed(()=>ko.unwrap(this.entityType)?new this.entityConstructor().FormFields():[]);NewItem=ko.observable();submit=()=>{(this.NewItem()?.validate()).length||(this.Value.push(this.NewItem()),this.NewItem(new this.entityConstructor))};add=e=>this.Value.push(e);remove=e=>this.Value.remove(e);updateEntityTypeHandler=e=>{e&&(this.multiple?this.NewItem(new this.entityConstructor):this.Value(new this.entityConstructor),this.blob&&this.fromJSON(JSON.parse(this.blob)))};applyValueToTypedValues=()=>{};components=ms}});var ys,Ln=ee(()=>{He();kt();ys=class extends Ie{constructor(e){super(e)}components=ps}});var je,Je,Mn=ee(()=>{kt();He();je={date:"date",datetime:"datetime-local"},Je=class extends Ie{constructor(e){super(e),this.type=e.type??je.date}toString=ko.pureComputed(()=>{switch(this.type){case je.date:return this.toLocaleDateString();case je.datetime:return this.toLocaleString();default:return""}});toSortableDateString=()=>this.Value()?.format("yyyy-MM-dd");toLocaleDateString=()=>this.Value()?.toLocaleDateString();toLocaleString=()=>this.Value()?.toLocaleString();toInputDateString=()=>{let e=this.Value();return[e.getUTCFullYear().toString().padStart(4,"0"),(e.getUTCMonth()+1).toString().padStart(2,"0"),e.getUTCDate().toString().padStart(2,"0")].join("-")};toInputDateTimeString=()=>this.Value().format("yyyy-MM-ddThh:mm");get=ko.pureComputed(()=>!this.Value()||isNaN(this.Value().valueOf())?null:this.Value().toISOString());set=e=>{if(!e)return null;e.constructor.getName()!="Date"&&(e=new Date(e)),e.getTimezoneOffset(),this.Value(e)};inputBinding=ko.pureComputed({read:()=>{if(!this.Value())return null;switch(this.type){case je.date:return this.toInputDateString();case je.datetime:return this.toInputDateTimeString();default:return null}},write:e=>{e&&this.Value(new Date(e))}});components=fs}});function Qn(t,e){if(t.FieldMap&&t.FieldMap[e]){let s=t.FieldMap[e];return typeof s=="function"?s():s.toString&&typeof s.toString=="function"?s.toString():s.get&&typeof s.get=="function"?s.get():s.obs?s.obs():s}return t[e]??""}var We,$n=ee(()=>{kt();He();We=class extends Ie{constructor({displayName:e,type:s,isRequired:n=!1,Visible:o,entitySet:r,options:a=ko.observableArray(),optionsFilter:l=null,optionsText:u=null,multiple:d=!1,lookupCol:m=null,instructions:p}){super({Visible:o,displayName:e,isRequired:n,instructions:p}),a?(this.isSearch=!1,this.allOpts=a):this.isSearch=!0,this.isSearch=!a,this.multiple=d,this.Value=d?ko.observableArray():ko.observable(),this.entityType=s,this.entitySet=r,this.lookupCol=m??"Title",this.optionsText=u??(g=>g[this.lookupCol]),l&&(this.optionsFilter=l),this.components=d?Ut:gs}isSearch=!1;allOpts;optionsFilter=e=>e;Options=ko.pureComputed(()=>{let e=ko.unwrap(this.optionsFilter);return ko.unwrap(this.allOpts).filter(e)});IsLoading=ko.observable(!1);HasLoaded=ko.observable(!1);refresh=async()=>{if(this.Value()){if(this.IsLoading(!0),!this.multiple){await this.entitySet.LoadEntity(this.Value()),this.IsLoading(!1),this.HasLoaded(!0);return}await Promise.all(this.Value().map(async e=>await this.entitySet.LoadEntity(e))),this.IsLoading(!1),this.HasLoaded(!0)}};ensure=async()=>{if(!this.HasLoaded()){if(this.IsLoading())return new Promise((e,s)=>{let n=this.IsLoading.subscribe(o=>{o||(n.dispose(),e())})});await this.refresh()}};toString=ko.pureComputed(()=>this.Value()?this.multiple?this.Value().map(e=>Qn(e,this.lookupCol)).join(", "):Qn(this.Value(),this.lookupCol):"");get=()=>{if(!this.Value())return;if(this.multiple)return this.Value().map(s=>({ID:s.ID,LookupValue:s.LookupValue,Title:s.Title}));let e=this.Value();return{ID:e.ID,LookupValue:e.LookupValue,Title:e.Title}};set=e=>{if(!e){this.Value(e);return}if(this.multiple){let s=Array.isArray(e)?e:e.results??e.split("#;");this.Value(s.map(n=>this.findOrCreateNewEntity(n)));return}this.Value(this.findOrCreateNewEntity(e)),e&&this.toString()};findOrCreateNewEntity=e=>{if(this.entityType.FindInStore){let o=this.entityType.FindInStore(e);if(o)return o;console.warn(`Could not find entity in store: ${this.entityType.name}`,e)}let s=this.allOpts().find(o=>o.ID==e.ID);if(s)return s;if(this.entityType.Create)return this.entityType.Create(e);let n=new this.entityType;return n.ID=e.ID,this.entitySet.LoadEntity(n),n}}});function Gt(t){return new Promise((e,s)=>t.executeQueryAsync(e,(n,o)=>{s({sender:n,args:o})}))}function zt(t,e=null){return{ID:t.get_id(),Title:t.get_title(),LoginName:t.get_loginName(),IsEnsured:!0,IsGroup:e??t.constructor.getName()=="SP.Group",oPrincipal:t}}function Ni(){let t=ne.globalConfig.defaultGroups,e={};return Object.keys(t).forEach(s=>{e[s]=zt(t[s],!0)}),e}async function Wn(t){if(Ei[t]?.Users?.constructor==Array)return Ei[t].Users;let e=`/web/sitegroups/GetByName('${t}')?$expand=Users`,n=(await Ue(e)).d;return n.Users=n.Users?.results,Ei[t]=n,n.Users}async function Kn(){if(!ne.utilities){console.log("Init Sal");var t=SP.ClientContext.get_current(),e=t.get_web();ne.globalConfig.defaultGroups={owners:e.get_associatedOwnerGroup(),members:e.get_associatedMemberGroup(),visitors:e.get_associatedVisitorGroup()},t.load(ne.globalConfig.defaultGroups.owners),t.load(ne.globalConfig.defaultGroups.members),t.load(ne.globalConfig.defaultGroups.visitors);var s=e.get_currentUser();t.load(s);var n=e.get_siteGroups();t.load(n),ne.globalConfig.roles=[];var o=t.get_web().get_roleDefinitions();return t.load(o),new Promise((r,a)=>{t.executeQueryAsync(function(){ne.globalConfig.currentUser=s;for(var l=n.getEnumerator();l.moveNext();){var u=l.get_current();ne.globalConfig.siteGroups.push(zt(u))}for(var d=o.getEnumerator();d.moveNext();){var m=d.get_current();ne.globalConfig.roles.push(m.get_name())}ne.config=new ne.NewAppConfig,ne.utilities=new ne.NewUtilities,r()},function(l,u){alert("Error initializing SAL"),a()})})}}async function Yn(t=_spPageContextInfo.userId){let e="/sp.userprofiles.peoplemanager/getmyproperties",s=`/Web/GetUserById(${t})/?$expand=Groups`,n=(await Ue(s)).d,o=(await Ue(e))?.d.UserProfileProperties.results;function r(a,l){return a.find(u=>u.Key==l)?.Value}return{ID:t,Title:n.Title,LoginName:n.LoginName,WorkPhone:r(o,"WorkPhone"),EMail:r(o,"WorkEmail"),IsEnsured:!0,IsGroup:!1,Groups:n.Groups?.results?.map(a=>({...a,ID:a.Id,IsGroup:!0,IsEnsured:!0}))}}async function Xn(t,e){let s=`/web/getfilebyserverrelativeurl('${t}')/copyto('${e}')`;return await Ue(s,"POST")}async function Bt(t){return new Promise((e,s)=>{var n=ne.globalConfig.siteGroups.find(function(d){return d.LoginName==t});if(n){e(n);return}var o=new SP.ClientContext.get_current,r=o.get_web().ensureUser(t);function a(d,m){let p=zt(r);e(p)}function l(d,m){console.error("Failed to ensure user :"+m.get_message()+`
`+m.get_stackTrace()),s(m)}let u={oUser:r,resolve:e,reject:s};o.load(r),o.executeQueryAsync(Function.createDelegate(u,a),Function.createDelegate(u,l))})}function jn(t){var e=null;return this.globalConfig.siteGroups!=null&&(e=this.globalConfig.siteGroups.find(function(s){return s.Title==t})),e}function zn(t){var e=this;e.config={def:t};async function s(){if(!e.config.fieldSchema){let v=`/web/lists/GetByTitle('${e.config.def.title}')?$expand=Fields`,R=await Ue(v);e.config.guid=R.d.Id,e.config.fieldSchema=R.d.Fields.results}}s();async function n(v,R){let x=new SP.ClientContext.get_current().get_web().get_lists().getByTitle(e.config.def.title);return L(x,v,R)}function o(v,R,C){C=C===void 0?!1:C;var _=new Array,x=new Array,q=new SP.ClientContext.get_current,F=q.get_web(),I=F.get_lists().getByTitle(e.config.def.title);v.forEach(function(M){var J=jn(M[0]);J?x.push([J,M[1]]):_.push([q.get_web().ensureUser(M[0]),M[1]])});function K(){console.log("Successfully found item");var M=new SP.ClientContext.get_current,J=M.get_web();C?(I.resetRoleInheritance(),I.breakRoleInheritance(!1,!1),I.get_roleAssignments().getByPrincipal(ne.globalConfig.currentUser).deleteObject()):I.breakRoleInheritance(!1,!1),this.resolvedGroups.forEach(function(P){var O=SP.RoleDefinitionBindingCollection.newObject(M);O.add(J.get_roleDefinitions().getByName(P[1])),I.get_roleAssignments().add(P[0],O)}),this.users.forEach(function(P){var O=SP.RoleDefinitionBindingCollection.newObject(M);O.add(J.get_roleDefinitions().getByName(P[1])),I.get_roleAssignments().add(P[0],O)});var c={oList:I,callback:R};function f(){console.log("Successfully set permissions"),R(I)}function y(P,O){console.error("Failed to update permissions on List: "+this.oList.get_title()+O.get_message()+`
`,O.get_stackTrace())}M.load(I),M.executeQueryAsync(Function.createDelegate(c,f),Function.createDelegate(c,y))}function H(M,J){console.error("Failed to find List: "+this.oList.get_title+J.get_message(),J.get_stackTrace())}var E={oList:I,users:_,resolvedGroups:x,callback:R};q.load(I),_.map(function(M){q.load(M[0])}),q.executeQueryAsync(Function.createDelegate(E,K),Function.createDelegate(E,H))}function r(v){return v&&(Array.isArray(v)?v.map(R=>a(R)).join(";#"):a(v))}function a(v){return v.ID?`${v.ID};#${v.LookupValue??""}`:v.LookupValue?v.LookupValue:v.constructor.getName()=="Date"?v.toISOString():v}function l(v,R=null){return new Promise((C,_)=>{let x=new SP.ClientContext.get_current,F=x.get_web().get_lists().getByTitle(e.config.def.title),I=new SP.ListItemCreationInformation;if(R){var K=ne.globalConfig.siteUrl+"/Lists/"+e.config.def.name+"/"+R;I.set_folderUrl(K)}let H=F.addItem(I),E=["ID","Author","Created","Editor","Modified"];Object.keys(v).filter(f=>!E.includes(f)).forEach(f=>{H.set_item(f,r(v[f]))}),H.update();function M(){C(H.get_id())}function J(f,y){console.error("Create Item Failed - List: "+e.config.def.name),console.error("ValuePairs",v),console.error(f,y),_(f)}let c={entity:v,oListItem:H,resolve:C,reject:_};x.load(H),x.executeQueryAsync(Function.createDelegate(c,M),Function.createDelegate(c,J))})}function u(v){if(!v)return v;let R={};switch(v.constructor.getName()){case"SP.FieldUserValue":R.LoginName=v.get_email();case"SP.FieldLookupValue":R.ID=v.get_lookupId(),R.LookupValue=v.get_lookupValue(),R.Title=v.get_lookupValue();break;default:R=v}return R}function d(v,R,C){var _=new SP.CamlQuery.createAllItemsQuery;_.set_viewXml(v);var x=new SP.ClientContext.get_current,q=x.get_web(),F=q.get_lists().getByTitle(e.config.def.title),I=F.getItems(_);function K(){var M=this,J=M.collListItem.getEnumerator();let c=[];for(;J.moveNext();){var f=J.get_current(),y={};R.forEach(P=>{var O=f.get_item(P);y[P]=Array.isArray(O)?O.map(Z=>u(Z)):u(O)}),c.push(y)}C(c)}function H(M,J){console.log("unsuccessful read",M),alert("Request on list "+e.config.def.name+` failed, producing the following error: 
 `+J.get_message()+`
StackTrack: 
 `+J.get_stackTrace())}var E={collListItem:I,callback:C,fields:R,camlQuery:_};x.load(I,`Include(${R.join(", ")})`),x.executeQueryAsync(Function.createDelegate(E,K),Function.createDelegate(E,H))}function m({fields:v=null,caml:R=null}){if(!R)var R='<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="FSObjType"/><Value Type="int">0</Value></Eq></Where></Query></View>';return new Promise((C,_)=>{d(R,v,C)})}function p(v,R){return new Promise((C,_)=>{try{w(v,R,C)}catch(x){_(x)}})}async function g(v,R){let[C,_]=await h(R),x=`/web/lists/GetByTitle('${e.config.def.title}')/items(${v})?$Select=${C}&$expand=${_}`;return(await Ue(x)).d}async function b(){if(!e.config.fieldSchema){let v=`/web/lists/GetByTitle('${e.config.def.title}')/Fields`,R=await Ue(v);e.config.fieldSchema=R.d.results}return e.config.fieldSchema}async function h(v){let R=[],C=[],_=await b();return v.map(x=>{if(x=="FileRef"){R.push(x);return}if(x.includes("/")){R.push(x),C.push(x.split("/")[0]);return}let q=_.find(K=>K.StaticName==x);if(!q){alert(`Field '${x}' not found on list ${e.config.def.name}`);return}let F=x+"/ID",I=x+"/Title";switch(q.TypeAsString){case"LookupMulti":case"Lookup":I=x+"/"+q.LookupField;case"User":R.push(F),R.push(I),C.push(x);break;case"Choice":default:R.push(x)}}),[R,C]}async function S(v,{orderByColumn:R=null,sortAsc:C},{count:_=null,includePermissions:x=!1,includeFolders:q=!1},F){let[I,K]=await h(F);x&&(I.push("RoleAssignments"),I.push("HasUniqueRoleAssignments"),K.push("RoleAssignments"));let H=R?`$orderby=${R} ${C?"asc":"desc"}`:"",E=[];v.forEach(Z=>E.push(`${Z.column} ${Z.op??"eq"} '${Z.value}'`)),q||E.push("FSObjType eq '0'");let M="$filter=("+E.join(") and (")+")",J="$select="+I,c="$expand="+K,f=_?`$top=${_}`:"",y=`/web/lists/GetByTitle('${e.config.def.title}')/items?${J}&${c}&${H}&${M}&${f}`,P=await Ue(y);return{results:P?.d?.results,_next:P?.d?.__next}}async function A(v){let R=await Ue(v._next);return{results:R?.d?.results,_next:R?.d?.__next}}function w(v,R,C){var _=new SP.ClientContext.get_current,x=_.get_web(),q=x.get_lists().getByTitle(e.config.def.title),F=q.getItemById(v);function I(){let E={};R.forEach(M=>{var J=F.get_item(M);E[M]=Array.isArray(J)?J.map(c=>u(c)):u(J)}),C(E)}function K(E,M){console.error("SAL: findById - List: "+e.config.def.name),console.error("Fields",this),console.error(E,M)}var H={oListItem:F,callback:C,fields:R};_.load(F),_.executeQueryAsync(Function.createDelegate(H,I),Function.createDelegate(H,K))}function D(v){return v?.ID?new Promise((R,C)=>{let _=new SP.ClientContext.get_current,F=_.get_web().get_lists().getByTitle(e.config.def.title).getItemById(v.ID),I=["ID","Author","Created","Editor","Modified"];Object.keys(v).filter(M=>!I.includes(M)).forEach(M=>{F.set_item(M,r(v[M]))}),F.update();function K(){console.log("Successfully updated "+this.oListItem.get_item("Title")),R()}function H(M,J){console.error("Update Failed - List: "+e.config.def.name),console.error("Item Id",this.oListItem.get_id()??"N/A"),console.error(v),console.error(M,J),C(J)}let E={oListItem:F,entity:v,resolve:R,reject:C};_.load(F),_.executeQueryAsync(Function.createDelegate(E,K),Function.createDelegate(E,H))}):!1}function k(v,R){var C=new SP.ClientContext.get_current,_=C.get_web(),x=_.get_lists().getByTitle(e.config.def.title),q={callback:R};x.getItemById(v).deleteObject();function I(H,E){R()}function K(H,E){console.error("sal.SPList.deleteListItem: Request on list "+e.config.def.name+` failed, producing the following error: 
 `+E.get_message()+`
StackTrack: 
 `+E.get_stackTrace())}C.executeQueryAsync(Function.createDelegate(q,I),Function.createDelegate(q,K))}async function G(v){let R=`/web/lists/GetByTitle('${e.config.def.title}')/items(${v})`;return await Ue(R,"DELETE",{"If-Match":"*"})}async function Q(v,R,C){let x=new SP.ClientContext.get_current().get_web(),q=await W(v);return L(q,R,C)}async function L(v,R,C){C&&(v.resetRoleInheritance(),v.breakRoleInheritance(!1,!1));for(let _ of R.roles){let x=await Bt(_.principal.Title);if(!x)return;let q=new SP.ClientContext.get_current,F=q.get_web(),I=x.oPrincipal;q.load(I),_.roleDefs.map(H=>{let E=SP.RoleDefinitionBindingCollection.newObject(q);E.add(F.get_roleDefinitions().getByName(H.name)),v.get_roleAssignments().add(I,E)});let K={};await Gt(q).catch(({sender:H,args:E})=>{console.error(`Failed to set role permissions on item id ${id} for principal ${_.principal.Title} `+E.get_message(),E)})}if(C){let _=new SP.ClientContext.get_current;v.get_roleAssignments().getByPrincipal(ne.globalConfig.currentUser).deleteObject(),await Gt(_).catch(({sender:x,args:q})=>{console.error(`Failed to remove role permissions on item id ${id} for Current User `+q.get_message(),q)})}}function W(v){return new Promise((R,C)=>{let _=new SP.ClientContext.get_current,F=_.get_web().get_lists().getByTitle(e.config.def.title).getItemById(v);_.executeQueryAsync(()=>{R(F)},(I,K)=>{console.error("Failed to find item: "+v+K.get_message(),K),C()})})}function Y(v){return new Promise((R,C)=>{var _=new SP.ClientContext.get_current,x=_.get_web(),q=x.get_lists().getByTitle(e.config.def.title),F=new SP.CamlQuery;F.set_viewXml('<View><Query><Where><Eq><FieldRef Name="ID"/><Value Type="Text">'+v+"</Value></Eq></Where></Query></View>");var I=q.getItems(F);_.load(I,"Include(ID, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))");function K(){for(var M=I.getEnumerator();M.moveNext();){for(var J=M.get_current(),c=new xe({hasUniqueRoleAssignments:J.get_hasUniqueRoleAssignments(),roles:[]}),f=J.get_roleAssignments().getEnumerator();f.moveNext();){var y=f.get_current();let P=Ye.fromJsomRole(y);c.roles.push(P)}R(c);break}}function H(M,J){C(J.get_message())}let E={oListItems:I,resolve:R,reject:C};_.executeQueryAsync(Function.createDelegate(E,K),Function.createDelegate(E,H))})}async function N(){let v=`/web/lists/getByTitle('${e.config.def.name}')?$select=HasUniqueRoleAssignments,RoleAssignments&$expand=RoleAssignments/Member,RoleAssignments/RoleDefinitionBindings`,C=await Ue(v,"GET",{"Cache-Control":"no-cache"});if(C)return xe.fromRestResult(C.d)}function V(v){let R=ne.globalConfig.siteUrl;return R+=e.config.def.isLib?"/"+e.config.def.name:"/Lists/"+e.config.def.name,v&&(R+="/"+v),R}function B(v){return e.config.def.isLib?new Promise((R,C)=>oe(v,R)):new Promise((R,C)=>ae(v,R))}async function X(v){try{let C=(await re(v)).map(_=>[_.LoginName,ne.config.siteRoles.roles.RestrictedRead]);await Ae(v,C,!0)}catch(R){console.warn(R)}}async function U(v,R){let C=V(v),_=ne.globalConfig.siteUrl+`/_api/web/GetFolderByServerRelativeUrl('${C}')/ListItemAllFields/RoleAssignments?$expand=Member,Member/Users,RoleDefinitionBindings`,x=await fetch(_,{method:"GET",headers:{Accept:"application/json; odata=verbose"}});if(!x.ok){if(x.status==404)return;console.error(x)}let q=await x.json(),F=q?.d?.results;if(!F){console.warn("No results found",q);return}let I=R.filter(K=>{let H=K[0],E=K[1];return!F.find(J=>J.Member.LoginName!=H&&!J.Member.Users?.results.find(c=>c.LoginName==H)?!1:!!J.RoleDefinitionBindings.results?.find(c=>ne.config.siteRoles.fulfillsRole(c.Name,E)))});console.log("Adding missing permissions",I),I.length&&await Ae(v,I,!1)}function ie(v,R){return new Promise((C,_)=>{let x=new SP.ClientContext.get_current,F=x.get_web().get_lists().getByTitle(e.config.def.title),I=V(v),K=SP.CamlQuery.createAllItemsQuery();K.set_folderServerRelativeUrl(I);let H=F.getItems(K);x.load(H,`Include(${R.join(", ")})`),x.executeQueryAsync(function(){let E=[];for(var M=H.getEnumerator();M.moveNext();){var J=M.get_current(),c={};R.forEach(f=>{var y=J.get_item(f);c[f]=Array.isArray(y)?y.map(P=>u(P)):u(y)}),c.oListItem=J,E.push(c)}C(E)},function(E,M){console.warn("Unable load list folder contents:"),console.error(E),console.error(M),_(M)})})}async function re(v){return new Promise(async(R,C)=>{let _=await ye(v);if(!_){C("Folder item does not exist");return}let x=_.get_roleAssignments(),q=new SP.ClientContext.get_current;q.load(_),q.load(x),q.executeQueryAsync(function(){let F=new SP.ClientContext.get_current;console.log(_);let I=[],K=[],H=x.getEnumerator();for(;H.moveNext();){let E=H.get_current(),M=E.get_member(),J=E.get_roleDefinitionBindings();F.load(J),F.load(M),I.push({principal:M,bindings:J})}F.executeQueryAsync(function(E,M){let J=I.map(function({principal:c,bindings:f}){let y=[],P=f.getEnumerator();for(;P.moveNext();){let O=P.get_current();y.push(O.get_name())}return{ID:c.get_id(),Title:c.get_title(),LoginName:c.get_loginName(),Roles:y}});R(J)},function(E,M){console.warn("Unable load folder principals permissions:"),console.error(E),console.error(M),C(M)})},function(F,I){console.warn("Unable load folder permissions:"),console.error(F),console.error(I),C(I)})})}async function ye(v){return new Promise((R,C)=>{let _=new SP.ClientContext.get_current,q=_.get_web().get_lists().getByTitle(e.config.def.title),F=SP.CamlQuery.createAllItemsQuery();var K='<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name="FSObjType"/><Value Type="int">1</Value></Eq><Eq><FieldRef Name="FileRef"/><Value Type="Text">'+V(v)+"</Value></Eq></And></Where></Query><RowLimit>1</RowLimit></View>";F.set_viewXml(K);let H=q.getItems(F);async function E(){let c=[];for(var f=H.getEnumerator();f.moveNext();){let P=f.get_current();c.push(P)}c||(console.warn("folder not found"),R(c)),c.length>1&&(console.warn("Multiple folders found!"),R(c));let y=c[0];R(y)}function M(c,f){console.warn("Unable load list folder contents:"),console.error(c),console.error(f),C(f)}let J={allFolders:H,resolve:R,reject:C};_.load(H),_.executeQueryAsync(Function.createDelegate(J,E),Function.createDelegate(J,M))})}function ae(v,R){var C=v.split("/"),_=0,x=function(q,F,I,K){var H=F[I];I++;var E=F.slice(0,I).join("/");lt(E,function(M){I>=F.length?K(M.get_id()):x(E,F,I,K)},function(){e.createListFolder(H,function(M){I>=F.length?K(M):x(E,F,I,K)},q)})};x("",C,_,R)}e.createListFolder=function(v,R,C){C=C===void 0?"":C;let _=new SP.ClientContext.get_current,q=_.get_web().get_lists().getByTitle(e.config.def.title),F="",I=new SP.ListItemCreationInformation;I.set_underlyingObjectType(SP.FileSystemObjectType.folder),I.set_leafName(v),C&&(F=ne.globalConfig.siteUrl+"/Lists/"+e.config.def.name+"/"+C,I.set_folderUrl(F));let K=q.addItem(I);K.set_item("Title",v),K.update();function H(J,c){R(this.newItem.get_id())}function E(J,c){alert("Request on list "+e.config.def.name+` failed, producing the following error: 
`+c.get_message()+`
StackTrack: 
`+c.get_stackTrace())}let M={folderName:v,callback:R,newItem:K};_.load(K),_.executeQueryAsync(Function.createDelegate(M,H),Function.createDelegate(M,E))};function lt(v,R,C){var _=ne.globalConfig.siteUrl+"/Lists/"+e.config.def.name+"/"+v,x=SP.ClientContext.get_current(),q=x.get_web().getFolderByServerRelativeUrl(_);q.get_listItemAllFields();var F={folder:q,path:v,onExists:R,onNonExists:C};x.load(q,"Exists","Name");function I(){if(q.get_exists()){let M=function(){R(E)},J=function(c,f){console.error("Failed to find folder at "+v,f)};console.log("Folder "+q.get_name()+" exists in "+e.config.def.name);var H=new SP.ClientContext.get_current,E=q.get_listItemAllFields();F={folderItem:E,path:v,onExists:R},H.load(E),H.executeQueryAsync(Function.createDelegate(F,M),Function.createDelegate(F,J))}else console.warn("Folder exists but is hidden (security-trimmed) for us.")}function K(H,E){E.get_errorTypeName()==="System.IO.FileNotFoundException"?(console.log("SAL.SPList.ensureListFolder:           Folder "+v+" does not exist in "+e.config.def.name),C()):console.error("Error: "+E.get_message())}x.executeQueryAsync(Function.createDelegate(F,I),Function.createDelegate(F,K))}function oe(v,R){let x=new SP.ClientContext.get_current().get_web().get_lists().getByTitle(e.config.def.title);var q=function(F,I,K){var H=F.get_context(),E=I.split("/"),M=E[0],J=F.get_folders().add(M);H.load(J),H.executeQueryAsync(function(){if(E.length>1){var c=E.slice(1,E.length).join("/");q(J,c,K)}else K(J)},function(c,f){console.error("error creating new folder"),console.error(c),console.error(error)})};q(x.get_rootFolder(),v,R)}function Ae(v,R,C){return new Promise((_,x)=>{be(v,R,_,C)})}function be(v,R,C,_){_=_===void 0?!1:_;var x=[],q=[];let F=V(v),I=new SP.ClientContext.get_current,H=I.get_web().getFolderByServerRelativeUrl(F);R.forEach(function(c){var f=jn(c[0]);f?.oGroup?q.push([f.oGroup,c[1]]):x.push([I.get_web().ensureUser(c[0]),c[1]])});function E(){var c=new SP.ClientContext.get_current,f=c.get_web(),y=this.folder.get_listItemAllFields();_?(y.resetRoleInheritance(),y.breakRoleInheritance(!1,!1),y.get_roleAssignments().getByPrincipal(ne.globalConfig.currentUser).deleteObject()):y.breakRoleInheritance(!1,!1),this.resolvedGroups.forEach(function(z){var le=SP.RoleDefinitionBindingCollection.newObject(c);le.add(f.get_roleDefinitions().getByName(z[1])),y.get_roleAssignments().add(z[0],le)}),this.users.forEach(function(z){var le=SP.RoleDefinitionBindingCollection.newObject(c);le.add(f.get_roleDefinitions().getByName(z[1])),y.get_roleAssignments().add(z[0],le)});var P={folderItem:y,callback:C};function O(){console.log("Successfully set permissions"),this.callback(y)}function Z(z,le){console.error("Failed to update permissions on item: "+this.folderItem.get_lookupValue()+le.get_message()+`
`+le.get_stackTrace(),!1)}c.load(y),c.executeQueryAsync(Function.createDelegate(P,O),Function.createDelegate(P,Z))}function M(c,f){console.error("Something went wrong setting perms on library folder",f)}var J={folder:H,users:x,callback:C,resolvedGroups:q,valuePairs:R,reset:_};x.map(function(c){I.load(c[0])}),I.load(H),I.executeQueryAsync(Function.createDelegate(J,E),Function.createDelegate(J,M))}function qe(v,R,C,_){var x="";C.id&&(x=C.id);let q=SP.UI.$create_DialogOptions();var F=e.config.def.isLib?"/"+e.config.def.name+"/":"/Lists/"+e.config.def.name+"/",I="";C.rootFolder&&(I=ne.globalConfig.siteUrl+F+C.rootFolder);var K=e.config.def.isLib?"/"+e.config.def.name+"/forms/":"/Lists/"+e.config.def.name+"/";Object.assign(q,{title:R,dialogReturnValueCallback:_,args:JSON.stringify(C),height:800,url:ne.globalConfig.siteUrl+K+v+"?ID="+x+"&Source="+location.pathname+"&RootFolder="+I}),SP.UI.ModalDialog.showModalDialog(q)}function vt(v,R){var C=SP.UI.$create_DialogOptions();C.title="Check in Document",C.height="600",C.dialogReturnValueCallback=R,C.url=ne.globalConfig.siteUrl+"/_layouts/checkin.aspx?List={"+e.config.guid+"}&FileName="+v,SP.UI.ModalDialog.showModalDialog(C)}function Ft(v,R){let C=`/web/GetFileByServerRelativeUrl('${v}')/CheckIn(comment='${R}',checkintype=0)`;return Ue(C,"POST")}function $t(v){return new Promise(R=>{var C=SP.UI.$create_DialogOptions();C.title="Version History",C.height="600",C.dialogReturnValueCallback=R,C.url=Ht(v),SP.UI.ModalDialog.showModalDialog(C)})}function Ht(v){return ne.globalConfig.siteUrl+"/_layouts/15/versions.aspx?List={"+e.config.guid+"}&ID="+v}function Nt(v,R,C){return new Promise((_,x)=>{let q=new SP.ClientContext.get_current,I=q.get_web().get_lists().getByTitle(e.config.def.title);q.load(I),q.executeQueryAsync(function(){var K=ne.globalConfig.siteUrl=="/"?"":ne.globalConfig.siteUrl;let H=SP.UI.$create_DialogOptions();Object.assign(H,{title:R,dialogReturnValueCallback:_,args:JSON.stringify(C),url:K+"/_layouts/Upload.aspx?List="+I.get_id().toString()+"&RootFolder="+K+"/"+e.config.def.name+"/"+encodeURI(v)+"&Source="+location.pathname+"&args="+encodeURI(JSON.stringify(C))}),SP.UI.ModalDialog.showModalDialog(H)},function(K,H){console.error("Error showing file modal: "),console.error(K),console.error(H)})})}let ot=10485760,Me={start:"startupload",continue:"continueupload",finish:"finishupload"};async function Te(v,R,C,_){let x=v,q=ot,F=v.size,I=parseInt((F/q).toString(),10)+(F%q===0?1:0),K=R+"/"+C,H=xa(),E;for(_({currentBlock:0,totalBlocks:I}),E=await Ot(H,v.slice(0,q),K,R),i=2;i<I;i++)_({currentBlock:i,totalBlocks:I}),E=await cs(H,v.slice(E,E+q),E,K);_({currentBlock:I-1,totalBlocks:I});let M=await ut(H,v.slice(E),E,K);return _({currentBlock:I,totalBlocks:I}),M}async function Ot(v,R,C,_){let x=`/web/getFolderByServerRelativeUrl(@folder)/files/getByUrlOrAddStub(@file)/StartUpload(guid'${v}')?&@folder='${_}'&@file='${C}'`,I=await Ue(x,"POST",{"Content-Type":"application/octet-stream"},{body:R});if(!I){console.error("Error starting upload!");return}return parseFloat(I.d.StartUpload)}async function cs(v,R,C,_){let x=`/web/getFileByServerRelativeUrl(@file)/ContinueUpload(uploadId=guid'${v}',fileOffset=${C})?&@file='${_}'`,I=await Ue(x,"POST",{"Content-Type":"application/octet-stream"},{body:R});if(!I){console.error("Error starting upload!");return}return parseFloat(I.d.ContinueUpload)}async function ut(v,R,C,_){let x=`/web/getFileByServerRelativeUrl(@file)/FinishUpload(uploadId=guid'${v}',fileOffset=${C})?&@file='${_}'`,I=await Ue(x,"POST",{"Content-Type":"application/octet-stream"},{body:R});if(!I){console.error("Error starting upload!");return}return I}async function jt(v,R,C){return await fetch(_spPageContextInfo.webServerRelativeUrl+`/_api/web/GetFolderByServerRelativeUrl('${R}')/Files/add(url='${C}',overwrite=true)`,{method:"POST",credentials:"same-origin",body:v,headers:{Accept:"application/json; odata=verbose","Content-Type":"application/json;odata=nometadata","X-RequestDigest":document.getElementById("__REQUESTDIGEST").value}}).then(_=>{if(!_.ok){console.error("Error Uploading File",_);return}return _.json()})}async function Qe(v,R,C,_,x=null){x||(x=()=>{});let q=V(C),F=null;if(v.size>ot){let H=()=>Te(v,q,R,x);F=await qa.addJob(H)}else x({currentBlock:0,totalBlocks:1}),F=await jt(v,q,R),x({currentBlock:1,totalBlocks:1});await Wt(F.d,_),await Ft(q+"/"+R,"");let I=F.d.ListItemAllFields.__deferred.uri+"?$select=ID";return(await Ue(I)).d.ID}async function Wt(v,R){var C=await fetch(v.ListItemAllFields.__deferred.uri,{method:"POST",credentials:"same-origin",body:JSON.stringify(R),headers:{Accept:"application/json; odata=nometadata","Content-Type":"application/json;odata=nometadata","X-RequestDigest":document.getElementById("__REQUESTDIGEST").value,"X-HTTP-Method":"MERGE","If-Match":"*"}}).then(_=>{if(!_.ok){console.error("Error Updating File",_);return}return _});return C}function Ti(v,R,C,_){let x=V(v),q=V(R);var F=new SP.ClientContext.get_current,I=F.get_web(),K=I.getFolderByServerRelativeUrl(x);F.load(K,"Files"),F.executeQueryAsync(function(){for(var H=K.get_files(),E=H.getEnumerator(),M=[];E.moveNext();){var J=E.get_current(),c=q+"/"+J.get_name();M.push(c),J.copyTo(c,!0)}console.log(M),F.executeQueryAsync(function(){console.log("Files moved successfully!"),C()},function(f,y){console.log("error: ")+y.get_message()})},function(H,E){console.error("Unable to copy files: ",E.get_message()),console.error(H),console.error(E),reject(E)})}function Ii(v,R){return new Promise((C,_)=>{Ti(v,R,C,_)})}async function gn(){let v=await Ue(`/web/lists/GetByTitle('${e.config.def.title}')`)}return{findByIdAsync:p,getById:g,findByColumnValueAsync:S,loadNextPage:A,getListItemsAsync:m,createListItemAsync:l,updateListItemAsync:D,deleteListItemAsync:G,setItemPermissionsAsync:Q,getItemPermissionsAsync:Y,getListPermissions:N,setListPermissionsAsync:n,getFolderContentsAsync:ie,upsertFolderPathAsync:B,getServerRelativeFolderPath:V,setFolderReadonlyAsync:X,setFolderPermissionsAsync:Ae,ensureFolderPermissionsAsync:U,uploadFileToFolderAndUpdateMetadata:Qe,uploadNewDocumentAsync:Nt,copyFilesAsync:Ii,showModal:qe,showCheckinModal:vt,showVersionHistoryModal:$t,getVersionHistoryUrl:Ht}}async function Ue(t,e="GET",s={},n={}){let o=t.startsWith("http")?t:ne.globalConfig.siteUrl+"/_api"+t,r=await fetch(o,{method:e,headers:{Accept:"application/json; odata=verbose","X-RequestDigest":document.getElementById("__REQUESTDIGEST").value,...s},...n});if(!r.ok){if(r.status==404)return;console.error(r)}try{return await r.json()}catch{return}}function xa(){if(crypto.randomUUID)return crypto.randomUUID();let t=Date.now();return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){let s=(t+Math.random()*16)%16|0;return t=Math.floor(t/16),(e==="x"?s:s&3|8).toString(16)})}var ne,Hn,Ei,yd,xe,Ye,Ze,Fi,qa,Ms=ee(()=>{window.console=window.console||{log:function(){}};window.sal=window.sal??{};ne=window.sal,Hn=_spPageContextInfo.webServerRelativeUrl=="/"?"":_spPageContextInfo.webServerRelativeUrl;ne.globalConfig=ne.globalConfig||{siteGroups:[],siteUrl:Hn,listServices:Hn+"/_vti_bin/ListData.svc/",defaultGroups:{}};ne.site=ne.site||{};window.DEBUG=!0;Ei={};yd=_spPageContextInfo.webAbsoluteUrl=="/"?"":_spPageContextInfo.webAbsoluteUrl;ne.NewAppConfig=function(){var t={};t.roles={FullControl:"Full Control",Design:"Design",Edit:"Edit",Contribute:"Contribute",RestrictedContribute:"Restricted Contribute",InitialCreate:"Initial Create",Read:"Read",RestrictedRead:"Restricted Read",LimitedAccess:"Limited Access"},t.fulfillsRole=function(n,o){let r=Object.values(t.roles);return!r.includes(n)||!r.includes(o)?!1:r.indexOf(n)<=r.indexOf(o)},t.validate=function(){Object.keys(t.roles).forEach(function(n){var o=t.roles[n];ne.globalConfig.roles.includes(o)?console.log(o):console.error(o+" is not in the global roles list")})};var e={groups:{Owners:"workorder Owners",Members:"workorder Members",Visitors:"workorder Visitors",RestrictedReaders:"Restricted Readers"}},s={siteRoles:t,siteGroups:e};return s};ne.NewUtilities=function(){function t(a,l,u){u=u===void 0?null:u;var d=new SP.ClientContext.get_current,m=d.get_web(),p=new SP.GroupCreationInformation;p.set_title(a),this.oGroup=oWebsite.get_siteGroups().add(p),oGroup.set_owner(oWebsite.get_associatedOwnerGroup()),oGroup.update();var g=SP.RoleDefinitionBindingCollection.newObject(clientContext);this.oRoleDefinitions=[],l.forEach(function(w){var D=oWebsite.get_roleDefinitions().getByName(w);this.oRoleDefinitions.push(D),g.add(D)});var b=oWebsite.get_roleAssignments();b.add(oGroup,g);function h(){var w=oGroup.get_title()+" created and assigned to "+oRoleDefinitions.forEach(function(D){D+""});u&&u(oGroup.get_id()),console.log(w)}function S(w,D){alert(groupnName+" - Create group failed. "+D.get_message()+`
`+D.get_stackTrace())}clientContext.load(oGroup,"Title");var A={groupName:a,oGroup,oRoleDefinition,callback:u};clientContext.executeQueryAsync(Function.createDelegate(A,h),Function.createDelegate(A,S))}function e(a,l){var u=new SP.ClientContext.get_current,d=u.get_web(),m=d.ensureUser(a),p=m.get_groups();function g(){for(var h=new Array,S=new String,A=p.getEnumerator();A.moveNext();){var w=A.get_current(),D=zt(w);S+=`
Group ID: `+w.get_id()+", Title : "+w.get_title(),h.push(D)}console.log(S.toString()),l(h)}function b(h,S){console.error(" Everyone - Query Everyone group failed. "+S.get_message()+`
`+S.get_stackTrace())}u.load(m),u.load(p),data={everyone:m,oGroups:p,callback:l},u.executeQueryAsync(Function.createDelegate(data,g),Function.createDelegate(data,b))}function s(a,l){var u=new SP.ClientContext.get_current,d=a.get_users();function m(){for(var b=[],h=d.getEnumerator();h.moveNext();){var S=h.get_current(),A=zt(S);b.push(A)}l(b)}function p(b,h){}var g={oUsers:d,callback:l};u.load(d),u.executeQueryAsync(Function.createDelegate(g,m),Function.createDelegate(g,p))}function n(a,l,u,d){var m=new SP.ClientContext.get_current,p=m.get_web(),g=p.getFolderByServerRelativeUrl(a);m.load(g,"Files"),m.executeQueryAsync(function(){console.log("Got the source folder right here!");for(var b=g.get_files(),h=b.getEnumerator(),S=[];h.moveNext();){var A=h.get_current(),w=l+"/"+A.get_name();S.push(w),A.copyTo(w,!0)}console.log(S),m.executeQueryAsync(function(){console.log("Files moved successfully!"),u()},function(D,k){console.log("error: ")+k.get_message()})},function(b,h){console.log("Sorry, something messed up: "+h.get_message())})}function o(a,l){return new Promise((u,d)=>{n(a,l,u,d)})}var r={copyFiles:n,copyFilesAsync:o,createSiteGroup:t,getUserGroups:e,getUsersWithGroup:s};return r};xe=class t{constructor({hasUniqueRoleAssignments:e,roles:s}){this.hasUniqueRoleAssignments=e,this.roles=s}hasUniqueRoleAssignments;roles=[];addPrincipalRole(e,s){let n=new Ze({name:s}),o=this.getPrincipalRole(e);if(o){o.addRoleDef(n);return}let r=new Ye({principal:e});r.addRoleDef(n),this.roles.push(r)}getPrincipalRole(e){return this.roles.find(s=>s.principal.ID==e.ID)}principalHasPermissionKind(e,s){return!!this.getPrincipalRole(e)?.roleDefs.find(o=>o.basePermissions?.has(s))}getValuePairs(){return this.roles.flatMap(e=>e.roleDefs.map(s=>[e.principal.Title,s.name]))}static fromRestResult(e){let s=e.RoleAssignments.results.map(Ye.fromRestRoleAssignment);return new t({hasUniqueRoleAssignments:e.HasUniqueRoleAssignments,roles:s})}},Ye=class t{constructor({principal:e,roleDefs:s=[]}){this.principal=e,this.roleDefs=s}principal;roleDefs=[];addRoleDef(e){this.roleDefs.push(e)}static fromRestRoleAssignment(e){return new t({principal:{...e.Member,ID:e.Member.Id},roleDefs:e.RoleDefinitionBindings.results.map(Ze.fromRestRoleDef)})}static fromJsomRole(e){let s=new t({principal:zt(e.get_member())});var n=e.get_roleDefinitionBindings();if(n!=null)for(var o=n.getEnumerator();o.moveNext();){var r=o.get_current();s.roleDefs.push(Ze.fromJsomRoleDef(r))}return s}},Ze=class t{constructor({name:e,basePermissions:s=null}){this.name=e,this.basePermissions=s}name;basePermissions;static fromRestRoleDef(e){let s=new t({name:e.Name,basePermissions:e.BasePermissions});return Object.assign(s,e),s}static fromJsomRoleDef(e){let s=new t({name:e.get_name()});return s.basePermissions=e.get_basePermissions(),s}};window.fetchSharePointData=Ue;Fi=class{constructor(e){this.maxConcurrency=e,this.runningJobs=0,this.queue=[]}addJob(e){return new Promise((s,n)=>{let o=async()=>{try{let r=await e();s(r)}catch(r){n(r)}finally{this.runningJobs--,this.processQueue()}};this.queue.push(o),this.processQueue()})}processQueue(){for(;this.runningJobs<this.maxConcurrency&&this.queue.length>0;){let e=this.queue.shift();this.runningJobs++,e()}}},qa=new Fi(5)});var mt,Jn=ee(()=>{te();qi();xi();te();Ms();He();mt=class extends Ie{constructor(e){super(e),this.spGroupName=e.spGroupName??null,this.multiple=e.multiple??!1,this.Value=this.multiple?ko.observableArray():ko.observable(),ko.isObservable(this.spGroupName)&&this.spGroupName.subscribe(this.spGroupNameChangedHandler),ko.unwrap(this.spGroupName)&&this.spGroupNameChangedHandler(ko.unwrap(this.spGroupName))}spGroupId=ko.observable();userOpts=ko.observableArray();expandUsers=ko.observable(!1);spGroupNameChangedHandler=async e=>{e||(this.userOpts.removeAll(),this.spGroupId(null));let s=await Bt(e);this.spGroupId(s.ID);let n=await Zn(e);this.userOpts(n.sort(Bs))};pickerOptions=ko.pureComputed(()=>{let e=ko.unwrap(this.spGroupId),s={AllowMultipleValues:this.multiple};return e&&(s.SharePointGroupID=e),s});toString=ko.pureComputed(()=>this.multiple?this.Value()?.map(e=>e.Title):this.Value()?.Title);set=e=>{if(!this.multiple){this.Value($e.Create(e));return}if(!e){this.Value.removeAll();return}let s=e.results??e;if(!s.length){this.Value.removeAll();return}this.Value(s.map(n=>$e.Create(n)))};components=hs}});var pt,eo=ee(()=>{kt();He();pt=class extends Ie{constructor({displayName:e,isRequired:s=!1,Visible:n,options:o,multiple:r=!1,optionsText:a,instructions:l}){super({Visible:n,displayName:e,isRequired:s,instructions:l}),this.Options(o),this.multiple=r,this.Value=r?ko.observableArray():ko.observable(),this.optionsText=a,this.components=this.multiple?Ut:vs}toString=ko.pureComputed(()=>this.multiple?this.Value().join(", "):this.Value());get=()=>this.Value();set=e=>{if(e&&this.multiple){Array.isArray(e)?this.Value(e):this.Value(e.results??e.split(";#"));return}this.Value(e)};Options=ko.observableArray()}});var wt,to=ee(()=>{kt();He();wt=class extends Ie{constructor(e){super(e),this.isRichText=e.isRichText,this.attr=e.attr??{}}components=bs}});var ge,so=ee(()=>{kt();He();ge=class extends Ie{constructor(e){super(e),this.attr=e.attr??{},this.options=e.options??null}components=Rs}});var He=ee(()=>{xn();Bn();Ln();Mn();$n();Jn();eo();to();so()});var we,Jt=ee(()=>{ft();He();we=class extends Xt{constructor(e){super(e)}toJSON=()=>{let e={};return Object.keys(this.FieldMap).map(s=>e[s]=this.FieldMap[s]?.get()),e};fromJSON(e){window.DEBUG&&console.log("Setting constrained entity from JSON",e),Object.keys(e).map(s=>this.FieldMap[s]?.set(e[s]))}get FieldMap(){let e={};return Object.entries(this).filter(([s,n])=>n instanceof Ie).map(([s,n])=>{s=n.systemName??s,e[s]=n}),e}FormFields=()=>Object.values(this.FieldMap);validate=(e=!0)=>(Object.values(this.FieldMap).map(s=>s?.validate&&s.validate(e)),this.Errors());Errors=ko.pureComputed(()=>Object.values(this.FieldMap).filter(e=>e?.Errors&&e.Errors()).flatMap(e=>e.Errors()));IsValid=ko.pureComputed(()=>!this.Errors().length)}});var ft=ee(()=>{Ls();Pn();Jt()});var Qs,io=ee(()=>{ft();Qs=class extends Xt{constructor(e){super(e)}static Views={All:["ID","Title","Created","Author","Modified","Editor"]};static ListDef={name:"Pages",title:"Pages"}}});var Lt=ee(()=>{xi();io()});var $s,no=ee(()=>{$s="/sites/CGFS/Style Library/apps/audit/src"});var Ea,Fa,oo=ee(()=>{Lt();te();no();ko.subscribable.fn.subscribeChanged=function(t){var e;this.subscribe(function(s){e=s},this,"beforeChange"),this.subscribe(function(s){t(s,e)})};ko.observableArray.fn.subscribeAdded=function(t){this.subscribe(function(e){let s=e.filter(n=>n.status=="added").map(n=>n.value);t(s)},this,"arrayChange")};ko.bindingHandlers.searchSelect={init:function(t,e,s){let{options:n,selectedOptions:o,optionsText:r,onSearchInput:a}=e();function l(){let d=ko.unwrap(n).map(m=>{let p=document.createElement("option");return ko.selectExtensions.writeValue(p,ko.unwrap(m)),p.innerText=r(m),ko.unwrap(o)?.find(g=>g.ID==m.ID)&&p.setAttribute("selected",""),p});t.append(...d)}l(),ko.isObservable(n)&&n.subscribe(()=>l(),this),ko.utils.registerEventHandler(t,"change",u=>{o(t.selectedOptions.map(d=>ko.selectExtensions.readValue(d)))}),a&&ko.utils.registerEventHandler(t,"input",u=>{a(u.originalEvent.target.searchInputElement.value)})},update:function(t,e,s,n,o){let{selectedOptions:r}=e(),a=ko.unwrap(r);for(var l=0;l<t.options.length;l++){let u=t.options[l];u.toggleAttribute("selected",a.includes(ko.selectExtensions.readValue(u)))}}};ko.bindingHandlers.people={init:function(t,e,s){var n={};n.PrincipalAccountType="User",n.SearchPrincipalSource=15,n.ShowUserPresence=!0,n.ResolvePrincipalSource=15,n.AllowEmailAddresses=!0,n.AllowMultipleValues=!1,n.MaximumEntitySuggestions=50,n.OnUserResolvedClientScript=async function(o,r){var a=SPClientPeoplePicker.SPClientPeoplePickerDict[o],l=e(),u=a.GetControlValueAsJSObject()[0];if(!u){l(null);return}if(u.IsResolved){if(u.Key==l()?.LoginName)return;var d=await Bt(u.Key),m=new $e(d);l(m)}},SPClientPeoplePicker_InitStandaloneControlWrapper(t.id,null,n)},update:function(t,e,s,n,o){var r=SPClientPeoplePicker.SPClientPeoplePickerDict[t.id+"_TopSpan"],a=ko.utils.unwrapObservable(e());if(!a){r?.DeleteProcessedUser();return}a&&!r.GetAllUserInfo().find(l=>l.DisplayText==a.LookupValue)&&r.AddUserKeys(a.LoginName??a.LookupValue??a.Title)}};ko.bindingHandlers.dateField={init:function(t,e,s){},update:function(t,e,s,n,o){}};ko.bindingHandlers.downloadLink={update:function(t,e,s,n,o){var r=e(),a=r.replace(/:([A-Za-z_]+)/g,function(l,u){return ko.unwrap(n[u])});t.href=a}};ko.bindingHandlers.files={init:function(t,e){function s(o){var r=e();if(!o.length){r.removeAll();return}let a=ko.unwrap(r),l=[];for(let u of o)a.find(d=>d.name==u.name)||l.push(u);ko.utils.arrayPushAll(r,l)}ko.utils.registerEventHandler(t,"change",function(){s(t.files)});let n=t.closest("label");n&&(ko.utils.registerEventHandler(n,"dragover",function(o){o.preventDefault(),o.stopPropagation()}),ko.utils.registerEventHandler(n,"dragenter",function(o){o.preventDefault(),o.stopPropagation(),n.classList.add("dragging")}),ko.utils.registerEventHandler(n,"dragleave",function(o){o.preventDefault(),o.stopPropagation(),n.classList.remove("dragging")}),ko.utils.registerEventHandler(n,"drop",function(o){o.preventDefault(),o.stopPropagation();let a=o.originalEvent.dataTransfer.files;s(a)}))},update:function(t,e,s,n,o){if(!e()().length&&t.files.length){t.value=null;return}}};ko.bindingHandlers.toggleClick={init:function(t,e,s){var n=e();ko.utils.registerEventHandler(t,"click",function(){var o=s.get("toggleClass"),r=s.get("classContainer"),a=s.get("containerType");if(a&&a=="sibling")$(t).nextUntil(r).each(function(){$(this).toggleClass(o)});else if(a&&a=="doc"){var l=$(t).attr("src");l=="/_layouts/images/minus.gif"?$(t).attr("src","/_layouts/images/plus.gif"):$(t).attr("src","/_layouts/images/minus.gif"),$(t).parent()&&$(t).parent().parent()&&$(t).parent().parent().nextUntil(r).each(function(){$(this).toggleClass(o)})}else a&&a=="any"?$("."+o).is(":visible")?$("."+o).hide():$("."+o).show():$(t).find(r).toggleClass(o)})}};ko.bindingHandlers.toggles={init:function(t,e){var s=e();ko.utils.registerEventHandler(t,"click",function(){s(!s())})}};Ea={loadTemplate:function(t,e,s){e.fromPath?fetch($s+e.fromPath).then(n=>{if(!n.ok)throw new Error(`Error Fetching HTML Template - ${n.statusText}`);return n.text()}).catch(n=>{e.fallback&&(console.warn("Primary template not found, attempting fallback",e),fetch($s+e.fallback).then(o=>{if(!o.ok)throw new Error(`Error Fetching fallback HTML Template - ${o.statusText}`);return o.text()}).then(o=>ko.components.defaultLoader.loadTemplate(t,o,s)))}).then(n=>n?ko.components.defaultLoader.loadTemplate(t,n,s):null):s(null)}};ko.components.loaders.unshift(Ea);Fa={loadViewModel:function(t,e,s){if(e.viaLoader){let n=import($s+e.viaLoader).then(o=>{let r=o.default;ko.components.defaultLoader.loadViewModel(t,r,s)})}else s(null)}};ko.components.loaders.unshift(Fa)});function ro({name:t,folder:e,module:s=null,moduleFilename:n=null,template:o}){ko.components.isRegistered(t)||(n||s?ko.components.register(t,{template:{fromPath:`/components/${e}/${o}.html`},viewModel:s??{viaLoader:`/components/${e}/${n}.js`}}):ko.components.register(t,{template:{fromPath:`/components/${e}/${o}.html`}}))}function he(t,{template:e,viewModel:s=null}){ko.components.register(t,{template:e,viewModel:s})}var ce,ao=ee(()=>{ce=String.raw});async function Zn(t){let e=await Wn(t);return e?e.map(s=>new People(s)):[]}var lo=ee(()=>{Ms()});var te=ee(()=>{In();oo();ao();Ms();lo()});var ws,Ve,Oi,uo,_t=ee(()=>{Ge();ws={},Ve=ko.observableArray(),Oi=t=>gt.ACTIONOFFICE==t.Role,uo=t=>gt.REQUESTINGOFFICE==t.Role});var Zt,co=ee(()=>{Ge();_t();Jt();He();Be();Zt=class extends we{constructor(e){super(e)}Title=new ge({displayName:"Title",required:!0});FileName=new ge({displayName:"Name",systemName:"FileLeafRef",required:!0});FileRef=new ge({displayName:"File Link",systemName:"FileRef"});ReqNum=new We({displayName:"Request Number",type:ke,lookupCol:"Title",required:!0,entitySet:T.AuditRequests});ActionOffice=new We({displayName:"Action Offices",type:at,options:Ve,optionsFilter:ko.pureComputed(()=>{let e=ko.unwrap(this.ReqNum.Value);if(!e)return n=>n;let s=ko.unwrap(e.ActionOffice.Value);return n=>s.includes(n)}),lookupCol:"Title",multiple:!0,entitySet:T.AuditOrganizations});static Views={All:["ID","Title","FileLeafRef","FileRef","ReqNum","ActionOffice"],AOCanUpdate:["Title","FileLeafRef","ActionOffice"]};static ListDef={title:"AuditCoversheets",name:"AuditCoversheets",isLib:!0}}});var Hs,mo=ee(()=>{Jt();Hs=class extends we{constructor(e){super(e)}static Views={All:["ID","Title","To","Body","NotificationType","ReqNum","ResID"]};static ListDef={name:"AuditEmails",title:"AuditEmails"}}});var gt,at,Ui=ee(()=>{Jt();gt={ACTIONOFFICE:"Action Office",REQUESTINGOFFICE:"Requesting Office",QUALITYASSURANCE:"Quality Assurance",SPECIALPERMISSIONS:"Special Permissions",RESTRICTEDREADERS:"Restricted Readers"},at=class extends we{constructor(e){super(e)}static Views={All:["ID","Title","Country","Organization_x0020_Description","EmailGroup","Org_Type","Post_x0020_Code","UserGroup","Role"]};static ListDef={name:"AuditOrganizations",title:"AuditOrganizations"}}});var nt,it,ke,Cs=ee(()=>{Ui();He();ft();Ls();_t();Be();nt={OPEN:"Open",CANCELLED:"Canceled",CLOSED:"Closed",REOPENED:"ReOpened"},it={TASKER:"Tasker",REQUEST:"Request",NOTIFICATION:"Notification"},ke=class extends we{constructor(e){super(e),this.InternalDueDate.addFieldRequirement({requirement:ko.pureComputed(()=>this.InternalDueDate.Value()>this.ReqDueDate.Value()),error:new Yt("text-field","required-field","The Internal Due Date must be before the Request Due Date!")})}ReqType=new pt({displayName:"Request Type",options:Object.values(it),isRequired:!0,instructions:ko.pureComputed(()=>{switch(this.ReqType.Value()){case it.TASKER:return"A request that doesn't require QA Approval.";case it.REQUEST:return"A request requiring QA Approval";case it.NOTIFICATION:return"A request that is closed after the email is sent";default:}})});ReqNum=new ge({displayName:"Request Number",systemName:"Title",isRequired:!0});ReqSubject=new ge({displayName:"Request Subject",isRequired:!0});RequestingOffice=new We({displayName:"Requesting Office",type:at,options:Ve,optionsFilter:uo,lookupCol:"Title",entitySet:T.AuditOrganizations,isRequired:!0});FiscalYear=new ge({displayName:"Fiscal Year",isRequired:!0});InternalDueDate=new Je({displayName:"Internal Due Date",type:je.date,isRequired:!0});ReqDueDate=new Je({displayName:"Request Due Date",type:je.date,isRequired:!0});ReqStatus=new pt({displayName:"Request Status",options:Object.values(nt),isRequired:!0});IsSample=new ys({displayName:"Is Sample?"});ReceiptDate=new Je({displayName:"Receipt Date",type:je.date,isRequired:!1});RelatedAudit=new ge({displayName:"Related Audit",isRequired:!1,instructions:"The Audit Request number of the similar audit performed in the previous FY"});ActionItems=new wt({displayName:"Action Items",instructions:"Items that have been requested by the Auditor",isRichText:!0,isMinimalEditor:!0,classList:["min-w-full"]});Comments=new wt({displayName:"Comments",isRichText:!0,isMinimalEditor:!0,classList:["min-w-full"]});Reminders=new pt({displayName:"Reminders",options:["3 Days Before Due","1 Day Before Due","1 Day Past Due","3 Days Past Due","7 Days Past Due"],multiple:!0});EmailSent=new ys({displayName:"Email has been sent"});Sensitivity=new pt({displayName:"Sensitivity",options:["None","Official","SBU","PII_SBU"]});ActionOffice=new We({displayName:"Action Offices",type:at,options:Ve,optionsFilter:Oi,lookupCol:"Title",multiple:!0,entitySet:T.AuditOrganizations});EmailActionOffice=new We({displayName:"Email Action Offices",type:at,options:Ve,optionsFilter:Oi,lookupCol:"Title",multiple:!0,entitySet:T.AuditOrganizations});ClosedDate=new Je({displayName:"Closed Date",isRequired:!1});ClosedBy=new mt({displayName:"Closed By",isRequired:!1});static Views={All:["ID","Title","ReqType","ReqSubject","FiscalYear","InternalDueDate","ReqDueDate","ReqStatus","IsSample","ReceiptDate","RelatedAudit","ActionItems","Comments","Reminders","EmailSent","Sensitivity","ActionOffice","EmailActionOffice","RequestingOffice","ClosedDate","ClosedBy"],New:["Title","ReqType","ReqSubject","RequestingOffice","FiscalYear","InternalDueDate","ReqDueDate","ReqStatus","IsSample","ReceiptDate","RelatedAudit","ActionItems","Comments","Reminders","Sensitivity","ActionOffice"],IACanUpdate:["ReqType","ReqSubject","FiscalYear","RequestingOffice","InternalDueDate","ReqDueDate","ReqStatus","IsSample","ReceiptDate","RelatedAudit","ActionItems","Comments","Reminders","Sensitivity","ActionOffice","EmailActionOffice","ClosedBy","ClosedDate"]};static ListDef={name:"AuditRequests",title:"AuditRequests"}}});var js,po=ee(()=>{Cs();js=class extends ke{constructor(e){super(e)}toRequest(){let e=new ke(this);return e.fromJSON(this.toJSON()),e}static Views={All:["ID","Title","ReqSubject","FiscalYear","InternalDueDate","ReqDueDate","ReqStatus","IsSample","ReceiptDate","RelatedAudit","ActionItems","Comments","Reminders","EmailSent","Sensitivity","ActionOffice","EmailActionOffice","EmailActionOffice","ClosedDate","ClosedBy"],New:["Title","ReqSubject","FiscalYear","InternalDueDate","ReqDueDate","ReqStatus","IsSample","ReceiptDate","RelatedAudit","ActionItems","Comments","Reminders","Sensitivity","ActionOffice"]};static ListDef={name:"AuditBulkRequests",title:"AuditBulkRequests"}}});var es,Vi=ee(()=>{ft();He();es=class t extends we{constructor(e){super(e)}id=new ge({displayName:"ID"});text=new ge({displayName:"Comment"});author=new ge({displayName:"author"});timestamp=new ge({displayName:"timestamp"});FieldMap={id:this.id,text:this.text,author:this.author,timestamp:this.timestamp};static Create({id:e,text:s,author:n,timestamp:o}){let r=new t;return r.id.Value(e),r.text.Value(s),r.author.Value(n),r.timestamp.Value(o),r}static Views={All:["id","text","author","timestamp"]}}});var Tt,Ws=ee(()=>{ft();He();Tt=class extends we{id=new ge({displayName:"ID"});viewer=new ge({displayName:"Viewer"});timestamp=new Je({displayName:"Timestamp",type:je.datetime});FieldMap={id:this.id,viewer:this.viewer,timestamp:this.timestamp};static Views={All:["id","viewer","timestamp"]}}});function Gi(t,e){var s=e.requestListTitle,n=e.columnName,o=e.initialValue,r=[];if(o)try{r=JSON.parse(o),r.forEach(function(S){S.timestamp=new Date(S.timestamp)})}catch{console.error("could not parse internal status comments.")}var a=ko.observableArray(r);function l(){u(_spPageContextInfo.userLoginName)}function u(S){var A=a().filter(function(D){return D.viewer!=S});a(A);var w={id:Math.ceil(Math.random()*1e6).toString(16),viewer:S,timestamp:new Date};a.push(w),b()}function d(){m(_spPageContextInfo.userLoginName)}function m(S){var A=a().filter(function(w){return w.viewer==S});A.length&&g(A[0])}function p(S){confirm("Are you sure you want to delete this item?")&&g(S)}function g(S){var A=a.indexOf(S);a.splice(A,1),b()}function b(){var S=new SP.ClientContext.get_current,A=S.get_web(),w=A.get_lists().getByTitle(s);let D=w.getItemById(t);D.set_item(n,JSON.stringify(a())),D.update(),S.load(D),S.executeQueryAsync(function(){},function(G,Q){console.error("Failed to commit changes - "+n,G)})}var h={viewers:a,pushCurrentUser:l,pushUser:u,removeCurrentuser:d,removeUserByLogin:m,onRemove:p};return h}var ts,Ks=ee(()=>{Ws();Be();ts=class{constructor({entity:e,fieldName:s}){this.entity=e,this.blobField=e[s],this.fieldName=s,this.viewers=this.blobField.TypedValues}entity;blobField;fieldName;pushCurrentUser(){this.pushUser(_spPageContextInfo.userLoginName)}pushUser(e){var s=this.viewers().filter(function(o){return o.viewer!=e});this.viewers(s);var n=new Tt;n.fromJSON({id:Math.ceil(Math.random()*1e6).toString(16),viewer:e,timestamp:new Date().toLocaleString()}),this.viewers.push(n),this.commitChanges()}removeUser(e){this.viewers.remove(e),this.commitChanges()}removeCurrentuser(){this.removeUserByLogin(_spPageContextInfo.userLoginName)}removeUserByLogin(e){var s=this.viewers().find(function(n){return n.viewer==e});s&&this.removeUser(s)}onRemove=e=>{confirm("Are you sure you want to delete this item?")&&this.removeUser(e)};async commitChanges(){let e=T.Set(this.entity.constructor);if(!e){alert("Cannot find entity set",this.entity);return}await e.UpdateEntity(this.entity,[this.fieldName])}}});var fo,go=ee(()=>{te();fo=ce`
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
`});var ho,Ys,Bi,Xs,Li=ee(()=>{Be();te();Vi();go();ho="commentChain",Ys=class{constructor({entity:e,fieldName:s}){this.entity=e,this.blobField=e[s],this.fieldName=s}entity;blobField;fieldName;componentName=ho},Bi=class{constructor({entity:e,fieldName:s,blobField:n}){this.entity=e,this.fieldName=s,this.blobField=n,this.comments=n.TypedValues}newCommentText=ko.observable();showHistoryBool=ko.observable(!1);toggleShowHistory=function(){this.showHistoryBool(!this.showHistoryBool())};async onSubmit(){var e=es.Create({id:Math.ceil(Math.random()*1e6).toString(16),text:this.newCommentText(),author:_spPageContextInfo.userLoginName,timestamp:new Date().toLocaleString()});this.blobField.add(e),await this.commitChanges(),this.newCommentText("")}onRemove=e=>{confirm("Are you sure you want to delete this item?")&&(this.blobField.remove(e),this.commitChanges())};async commitChanges(){let e=T.Set(this.entity.constructor);if(!e){alert("Cannot find entity set",this.entity);return}await e.UpdateEntity(this.entity,[this.fieldName])}};he(ho,{template:fo,viewModel:Bi});Xs=class{constructor(e,s){this.requestId=e,this.requestListTitle=s.requestListTitle,this.columnName=s.columnName;let n=s.initialValue;if(n)try{let o=JSON.parse(n);o.map(function(r){r.timestamp=new Date(r.timestamp)}),this.comments(o)}catch{console.error("could not parse internal status comments.")}}comments=ko.observableArray();newCommentText=ko.observable();showHistoryBool=ko.observable(!1);toggleShowHistory=function(){this.showHistoryBool(!this.showHistoryBool())};onSubmit=()=>{var e={id:Math.ceil(Math.random()*1e6).toString(16),text:this.newCommentText(),author:_spPageContextInfo.userLoginName,timestamp:new Date};this.comments.push(e),this.commitChanges(),this.newCommentText("")};onRemove=e=>{confirm("Are you sure you want to delete this item?")&&(this.comments.remove(e),this.commitChanges())};commitChanges=()=>{let e=new SP.ClientContext.get_current,o=e.get_web().get_lists().getByTitle(this.requestListTitle).getItemById(this.requestId);o.set_item(this.columnName,JSON.stringify(this.comments())),o.update(),e.load(o),e.executeQueryAsync(function(){},function(a,l){console.error("Failed to commit changes.",a)})}}});var ss,vo=ee(()=>{He();Jt();Cs();Vi();Ws();Ks();Li();Be();ss=class extends we{constructor(e){super(e)}ActiveViewers=new Vt({displayName:"Active Viewers",entityType:Tt,multiple:!0});InternalStatus=new Vt({displayName:"Internal Status",entityType:es,multiple:!0});ReqNum=new We({displayName:"Request",type:ke,lookupCol:"Title",entitySet:T.AuditRequests});commentChainComponent=new Ys({entity:this,fieldName:"InternalStatus"});activeViewersComponent=new ts({entity:this,fieldName:"ActiveViewers"});static Views={All:["ID","ActiveViewers","InternalStatus","ReqNum"]};static ListDef={title:"AuditRequestsInternal",name:"AuditRequestsInternal"}}});function ht(){let t=Ni(),e={};return Object.entries(t).map(([s,n])=>e[s]=new $e(n)),e}async function It(t){let e=await Bt(t);return e?new $e(e):null}async function bo(){if(Ss)return Ss;if(zs())return new Promise(s=>{let n=zs.subscribe(()=>{n.dispose(),s(Ss)})});zs(!0);let t=await It(Na),e=await It(Oa);return Ss={specialPermGroup1:t,specialPermGroup2:e},zs(!1),Ss}async function is(){return As||(Js()?new Promise(t=>{let e=Js.subscribe(()=>{e.dispose(),t(As)})}):(Js(!0),As=await It(Ua),Js(!1),As))}var Na,Oa,Ua,Ss,zs,As,Js,Mi,Zs,Mt=ee(()=>{Lt();te();Na="CGFS Special Access1",Oa="CGFS Special Access2",Ua="Quality Assurance";Ss=null,zs=ko.observable(!1);As=null,Js=ko.observable(!1);Mi=class t extends $e{constructor({ID:e,Title:s,LoginName:n=null,LookupValue:o=null,WorkPhone:r=null,EMail:a=null,IsGroup:l=null,IsEnsured:u=!1,Groups:d=null}){super({ID:e,Title:s,LookupValue:o,LoginName:n,IsGroup:l,IsEnsured:u}),this.WorkPhone=r,this.EMail=a,this.Groups=d}Groups=[];isInGroup(e){return e?.ID?this.getGroupIds().includes(e.ID):!1}getGroupIds(){return this.Groups.map(e=>e.ID)}IsSiteOwner=ko.pureComputed(()=>this.isInGroup(Ni().owners));hasSystemRole=e=>{let s=this.IsSiteOwner();switch(e){case systemRoles.Admin:return s;case systemRoles.ActionOffice:return s||this.ActionOffices().length;default:}};static _user=null;static Create=async function(){if(t._user)return t._user;let e=await Yn();return t._user=new t(e),t._user}},Zs=Mi.Create});var Re,Ke,ei=ee(()=>{ft();He();Ge();Be();Ws();Ks();_t();Mt();Re={Open:"1-Open",Submitted:"2-Submitted",ReturnedToAO:"3-Returned to Action Office",ApprovedForQA:"4-Approved for QA",ReturnedToGFS:"5-Returned to GFS",RepostedAfterRejection:"6-Reposted After Rejection",Closed:"7-Closed"},Ke=class extends we{constructor(e){super(e)}Title=new ge({displayName:"Name"});ReqNum=new We({displayName:"Request Number",type:ke,entitySet:T.AuditRequests});SampleNumber=new ge({displayName:"Sample Number",isRequired:!0});ResStatus=new pt({displayName:"Response Status",options:Object.values(Re)});ReturnReason=new ge({displayName:"Return Reason",options:["Incomplete Document","Incorrect POC"]});Comments=new wt({displayName:"Comments",isRichText:!0,isMinimalEditor:!0,classList:["min-w-full"]});ClosedDate=new Je({displayName:"Closed Date",type:je.date});ClosedBy=new mt({displayName:"Closed By"});POC=new mt({displayName:"POC"});POCCC=new mt({displayName:"POCCC"});ActionOffice=new We({displayName:"Action Office",type:at,options:Ve,optionsFilter:ko.pureComputed(()=>{let e=ko.unwrap(this.ReqNum.Value);if(!e)return n=>n;let s=ko.unwrap(e.ActionOffice.Value);return n=>s.includes(n)}),entitySet:T.AuditOrganizations,lookupCol:"Title",isRequired:!0});ActiveViewers=new Vt({displayName:"Active Viewers",entityType:Tt,multiple:!0});activeViewersComponent=new ts({entity:this,fieldName:"ActiveViewers"});async uploadResponseDocFile(e){let s={Title:e.name,ReqNumId:this.ReqNum.Value().ID,ResIDId:this.ID},{appContext:n}=await Promise.resolve().then(()=>(Be(),Ro));return await n.AuditResponseDocs.UploadFileToFolderAndUpdateMetadata(e,e.name,this.Title.Value(),s)}markClosed(){this.ResStatus.Value(Re.Closed),this.ClosedDate.set(new Date),this.ClosedBy.set(Zs())}static Views={All:["ID","Title","SampleNumber","ResStatus","ReturnReason","Comments","ClosedDate","ClosedBy","POC","POCCC","ReqNum","ActionOffice","ActiveViewers"],NewForm:["ReqNum","ActionOffice","SampleNumber","Comments"],EditForm:["ReqNum","SampleNumber","Title","ActionOffice","ResStatus","ReturnReason","Comments","ClosedDate","ClosedBy","POC","POCCC"],IACanUpdate:["Title","ActionOffice","ResStatus","ReturnReason","Comments","ClosedDate","ClosedBy","POC","POCCC"],IAUpdateClosed:["ResStatus","ClosedDate","ClosedBy"]};static ListDef={name:"AuditResponses",title:"AuditResponses"}}});var ti,yo=ee(()=>{Ge();ti=class extends Ke{constructor(e){super(e)}static ListDef={name:"AuditBulkResponses",title:"AuditBulkResponses"}}});var Xe,Ct,wo=ee(()=>{ft();He();ei();Cs();Be();Xe={Open:"Open",Submitted:"Submitted",SentToQA:"Sent to QA",Approved:"Approved",Rejected:"Rejected",Archived:"Archived",MarkedForDeletion:"Marked for Deletion"},Ct=class extends we{constructor(e){super(e)}Title=new ge({displayName:"Name"});ReceiptDate=new Je({displayName:"Receipt Date",type:je.date});DocumentStatus=new pt({displayName:"Document Status",options:Object.values(Xe)});RejectReason=new wt({displayName:"Reject Reason"});ReqNum=new We({displayName:"Request Number",type:ke,entitySet:T.AuditRequests});ResID=new We({displayName:"Response ID",type:Ke,entitySet:T.AuditResponses});FileName=new ge({displayName:"Name",systemName:"FileLeafRef"});FileRef=new ge({displayName:"File Link",systemName:"FileRef"});Modified=new Je({displayName:"Modified",type:je.datetime});Editor=new mt({displayName:"Modified By"});Created=new Je({displayName:"Created",type:je.datetime});FileSizeDisplay=new ge({displayName:"File"});File_x0020_Type=new ge({displayName:"File Type",systemName:"File_x0020_Type"});CheckoutUser=new mt({displayName:"Checked Out To"});markApprovedForRO(e){this.DocumentStatus.Value(Xe.Approved),this.RejectReason.Value(""),this.FileName.Value()!=e&&this.FileName.Value(e)}static Views={All:["ID","Title","ReceiptDate","DocumentStatus","RejectReason","ReqNum","ResID","FileLeafRef","FileRef","FileSizeDisplay","File_x0020_Type","CheckoutUser","Modified","Editor","Created"],EditForm:["FileLeafRef","Title","ReceiptDate","DocumentStatus","RejectReason","ReqNum","ResID"],AOCanUpdate:["Title","ReceiptDate","DocumentStatus","RejectReason","FileLeafRef"],UpdateDocStatus:["Title","FileLeafRef","DocumentStatus"]};static ListDef={name:"AuditResponseDocs",title:"AuditResponseDocs",isLib:!0}}});var ns,Co=ee(()=>{ft();ns=class extends we{constructor(e){super(e)}markApprovedForRO(e,s){this.ReqNum=e.Title,this.ResID=s.Title.toString(),this.FiscalYear=e.FiscalYear.toString(),this.ReqSubject=e.ReqSubject.toString(),this.RequestingOffice=e.RequestingOffice.Value()?.UserGroup?.Title}static Views={All:["ID","Title","ReqNum","ResID","FiscalYear","RequestingOffice","ReqSubject","FileLeafRef","FileRef"],ApprovedForROUpdate:["ReqNum","ResID","FiscalYear","ReqSubject","RequestingOffice"]};static ListDef={name:"AuditResponseDocsRO",title:"AuditResponseDocsRO"}}});var os,Qi=ee(()=>{ft();os=class t extends we{constructor(e){super(e)}Responses="";ResponseCount=0;static Views={All:["ID","Title","RequestingOffice","Responses","ResponseCount","SentEmail"]};static ListDef={name:"AuditROEmailLog",title:"AuditROEmailLog",fields:t.Views.All}}});var si,So=ee(()=>{ft();si=class extends we{constructor(e){super(e)}key;value;FieldMap={Title:{get:()=>this.key,set:e=>this.key=e},Value:{get:()=>this.value,set:e=>this.value=e}};static Views={All:["ID","Title","Value"]};static ListDef={name:"Config",title:"Config"}}});var Ge=ee(()=>{co();mo();Ui();Cs();po();vo();ei();yo();wo();Co();Qi();So()});function Pt(t,e){ii&&console.log(`ApplicationDBContext: ${e.constructor.name}: `,t),!(!t||!e)&&Object.keys(t).forEach(s=>{Va(s,t[s],e)})}function Va(t,e,s){if(ii&&console.log(`ApplicationDBContext: ${s.constructor.name}.${t} to ${e}`),s.FieldMap&&s.FieldMap[t]){Ga(e,s.FieldMap[t]);return}if(s[t]&&typeof s[t]=="function"){s[t](e);return}s[t]=e}function Ga(t,e){if(typeof e=="function"){e(t);return}if(typeof e!="object"){e=t;return}if(e.set&&typeof e.set=="function"){e.set(t);return}if(e.obs){if(!t){e.obs(null);return}let s=Array.isArray(t)?t.map(n=>Ao(n,e)):Ao(t,e);e.obs(s);return}e=t}function Ao(t,e){return e.factory?e.factory(t):t}function Do(t,e=null){let s={},n=new Set([]);this?.ListDef?.fields&&this.ListDef.fields.forEach(a=>n.add(a)),this?.AllDeclaredFields&&this.AllDeclaredFields.map(a=>n.add(a)),t.FieldMap&&Object.keys(t.FieldMap).forEach(a=>n.add(a));let o=[...n];return(e??(t.FieldMap?Object.keys(t.FieldMap):null)??Object.keys(t)).filter(a=>o.includes(a)).map(a=>{if(t.FieldMap&&t.FieldMap[a]){let l=t.FieldMap[a].systemName??a;s[l]=Ba(t.FieldMap[a]);return}s[a]=t[a]}),s}function Ba(t){return typeof t=="function"?t():t.get&&typeof t.get=="function"?t.get():t.obs?t.obs():t}var ii,Ds,Fe,_o=ee(()=>{Lt();te();ii=!1,Ds=class{constructor(){}Pages=new Fe(Qs);utilities={copyFileAsync:Xn};virtualSets=new Map;Set=e=>{let s=e.ListDef.name,n=Object.values(this).filter(o=>o.constructor.name==Fe.name).find(o=>o.ListDef?.name==s);if(n)return n;if(!this.virtualSets.has(s)){let o=new Fe(listDef);return this.virtualSets.set(s,o),o}return this.virtualSets.get(s)}},Fe=class{constructor(e){if(!e.ListDef){console.error("Missing entityType listdef for",e);return}this.entityType=e;try{let s=new Set;e.Views?.All?.map(n=>s.add(n)),this.AllDeclaredFields=[...s]}catch(s){console.warn("Could not instantiate",e),console.warn(s),this.AllDeclaredFields=e.Views?.All??[]}this.ListDef=e.ListDef,this.Views=e.Views,this.Title=e.ListDef.title,this.Name=e.ListDef.name,this.ListRef=new zn(e.ListDef),this.entityConstructor=this.entityType.FindInStore||this.entityType.Create||this.entityType}FindById=async(e,s=this.AllDeclaredFields)=>{let n=await this.ListRef.getById(e,s);if(!n)return null;let o=new this.entityType(n);return Pt(n,o),o};FindByColumnValue=async(e,{orderByColumn:s,sortAsc:n},{count:o=null,includePermissions:r=!1,includeFolders:a=!1},l=this.AllDeclaredFields)=>{let u=o!=null;o=o??5e3;let d=await this.ListRef.findByColumnValueAsync(e,{orderByColumn:s,sortAsc:n},{count:o,includePermissions:r,includeFolders:a},l),m={_next:d._next,results:d.results.map(g=>{let b=new this.entityConstructor(g);return Pt(g,b),b})};if(u)return m;let p={results:m.results};for(;m._next;)m=await this.LoadNextPage(m),p.results=p.results.concat(m.results);return p};LoadNextPage=async e=>{let s=await this.ListRef.loadNextPage(e);return{_next:s._next,results:s.results.map(n=>{let o=new this.entityType(n);return Pt(n,o),o})}};ToList=async(e=!1)=>{let s=this.Views.All;return(await this.ListRef.getListItemsAsync({fields:s})).map(r=>{let a=new this.entityType(r);return Pt(r,a),a})};LoadEntity=async function(e,s=!1){if(!e.ID)return console.error("entity missing Id",e),!1;let n=await this.ListRef.getById(e.ID,this.AllDeclaredFields);return n?(Pt(n,e),e):null};AddEntity=async function(e,s){let o=Do.bind(this)(e,this.AllDeclaredFields);ii&&console.log(o);let r=await this.ListRef.createListItemAsync(o,s);Pt({ID:r},e)};UpdateEntity=async function(e,s=null){let n=Do.bind(this)(e,s);return n.ID=typeof e.ID=="function"?e.ID():e.ID,ii&&console.log(n),this.ListRef.updateListItemAsync(n)};RemoveEntity=async function(e){return e.ID?(await this.ListRef.deleteListItemAsync(e.ID),!0):!1};RemoveEntityById=function(e){return this.ListRef.deleteListItemAsync(e)};GetItemPermissions=function(e){return this.ListRef.getItemPermissionsAsync(e.ID)};SetItemPermissions=async function(e,s,n=!1){return this.ListRef.setItemPermissionsAsync(e.ID,s,n)};GetRootPermissions=function(){return this.ListRef.getListPermissions()};SetRootPermissions=async function(e,s){await this.ListRef.setListPermissionsAsync(e,s)};GetFolderUrl=function(e=""){return this.ListRef.getServerRelativeFolderPath(e)};GetItemsByFolderPath=async function(e,s=this.AllDeclaredFields){return(await this.ListRef.getFolderContentsAsync(e,s)).map(o=>{let r=new this.entityType(o);return Pt(o,r),r})};UpsertFolderPath=async function(e){return this.ListRef.upsertFolderPathAsync(e)};RemoveFolderByPath=async function(e){let n=(await this.FindByColumnValue([{column:"FileLeafRef",value:e}],{},{},["ID","Title","FileLeafRef"],!0)).results??[];for(let o of n)await this.RemoveEntityById(o.ID)};SetFolderReadOnly=async function(e){return this.ListRef.setFolderReadonlyAsync(e)};SetFolderPermissions=async function(e,s,n=!0){let o=s.filter(r=>r[0]&&r[1]).map(r=>[r[0].getKey(),r[1]]);return this.ListRef.setFolderPermissionsAsync(e,o,n)};EnsureFolderPermissions=async function(e,s){let n=s.filter(o=>o[0]&&o[1]).map(o=>[o[0].LoginName??o[0].Title,o[1]]);return this.ListRef.ensureFolderPermissionsAsync(e,n)};UploadFileToFolderAndUpdateMetadata=async function(e,s,n,o,r){let a=await this.ListRef.uploadFileToFolderAndUpdateMetadata(e,s,n,o,r),l=await this.ListRef.getById(a,this.AllDeclaredFields),u=new this.entityConstructor(l);return Pt(l,u),u};UploadNewDocument=async function(e,s){return this.ListRef.uploadNewDocumentAsync(e,"Attach a New Document",s)};CopyFolderContents=async function(e,s){return this.ListRef.copyFilesAsync(e,s)};ShowForm=async function(e,s,n){return new Promise((o,r)=>this.ListRef.showModal(e,s,n,o))};CheckInDocument=async function(e){return new Promise(s=>this.ListRef.showCheckinModal(e,s))};EnsureList=async function(){}}});var To=ee(()=>{_o()});var Ro={};sa(Ro,{ApplicationDbContext:()=>ni,appContext:()=>T});var ni,T,Be=ee(()=>{Ge();To();ni=class extends Ds{constructor(){super()}AuditBulkRequests=new Fe(js);AuditBulkResponses=new Fe(ti);AuditConfigurations=new Fe(si);AuditCoversheets=new Fe(Zt);AuditEmails=new Fe(Hs);AuditOrganizations=new Fe(at);AuditResponses=new Fe(Ke);AuditResponseDocs=new Fe(Ct);AuditResponseDocsRO=new Fe(ns);AuditRequests=new Fe(ke);AuditRequestsInternals=new Fe(ss);AuditROEmailsLog=new Fe(os)},T=new ni});var ia=String.raw,Dn,kn=ia(Dn||(Dn=An([`
  <link
    href="/sites/CGFS/Style Library/apps/audit/lib/quill@2.0.0-rc.2/dist/quill.snow.css"
    rel="stylesheet"
  />

  <link
    rel="stylesheet"
    href="/sites/CGFS/Style Library/apps/audit/lib/fontawesome-6.5.1/css/fontawesome.min.css"
  />
  <link
    rel="stylesheet"
    href="/sites/CGFS/Style Library/apps/audit/lib/fontawesome-6.5.1/css/solid.min.css"
  />
  <link
    rel="stylesheet"
    type="text/css"
    href="/sites/CGFS/Style Library/apps/audit/lib/jquery-ui-1.13.2/jquery-ui.theme.min.css"
  />
  <style>
    .o365cs-nav-leftAlign {
      display: revert !important;
    }

    #suiteBarDelta {
      display: revert !important;
    }

    #s4-ribbonrow {
      display: revert !important;
    }
  </style>
  <iframe id="CsvExpFrame" style="display: none"></iframe>

  <div id="divRequestID" style="display: none">
    not in use anymore. do not delete, this is used by the request edit list
    form
  </div>
  <div class="audit">
    <!-- ko foreach: currentDialogs -->
    <div
      data-bind="component: { name: 'modal-dialog-component', params: $data }"
    ></div>
    <!-- /ko -->
    <div
      id="divCounter"
      style="display: none"
      title="used to auto refresh the page"
    >
      1200
    </div>

    <div id="divIA" class="audit-body" style="display: none">
      <div
        class="quick-info-container"
        data-bind="css: {active: showQuickInfo}"
      >
        <div class="quick-info-toolbar">
          <button
            type="button"
            class="btn btn-toolbar"
            data-bind="toggles: showQuickInfo,
          css: {'warn': alertQuickInfo},
          attr: {title: showQuickInfo() ? 'Hide Alerts' : 'Show Pending Alerts'}"
          >
            <i class="fa-solid fa-xl fa-triangle-exclamation"></i>
            <i
              class="fa-solid"
              data-bind="class: showQuickInfo() ? 'fa-chevron-left' : 'fa-chevron-right'"
            ></i>
          </button>
        </div>
        <div class="quick-info">
          <div id="divLoading">Please Wait... Loading</div>
          <div
            id="divRequestsThatNeedToClose"
            class="status-set-container"
            data-bind="visible: arrRequestsThatNeedClosing().length > 0"
          >
            <fieldset>
              <legend>
                <span class="ui-icon ui-icon-alert"></span
                ><span
                  data-bind="text: arrRequestsThatNeedClosing().length"
                ></span>
                Requests Need Closing
              </legend>
              <table id="tblRequestsThatNeedToClose" class="tablesorter report">
                <thead>
                  <tr valign="top">
                    <th class="sorter-false" nowrap="nowrap">Request ID</th>
                    <th class="sorter-false" nowrap="nowrap">
                      Last Response Closed
                    </th>
                  </tr>
                </thead>
                <tbody data-bind="foreach: arrRequestsThatNeedClosing">
                  <tr>
                    <td>
                      <button
                        type="button"
                        class="btn btn-link primary fw-bold"
                        title="Click here to Go to this Request"
                        data-bind="click: $root.ClickGoToRequest, text: number"
                      ></button>
                    </td>
                    <td>
                      <b><span data-bind="text: lastResponseId"></span></b
                      >&nbsp;on&nbsp;<b
                        ><span data-bind="text: sLastClosedDate"></span></b
                      >&nbsp;by&nbsp;<b
                        ><span data-bind="text: lastClosedBy"></span
                      ></b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </fieldset>
          </div>
          <div
            id="divRequestsWithNoEmailSent"
            class="status-set-container"
            title="Click here to View"
            data-bind="visible: arrRequestsWithNoEmailSent().length > 0"
          >
            <details>
              <summary>
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div>
                  <span
                    data-bind="text: arrRequestsWithNoEmailSent().length"
                  ></span>
                  Requests need Emails sent out
                </div>
              </summary>
              <div id="divRequestsWithNoEmailSentItems">
                <ul data-bind="foreach: arrRequestsWithNoEmailSent">
                  <li>
                    <a
                      href="javascript:void(0);"
                      title="Go to Request Details"
                      data-bind="click: $root.ClickGoToRequest"
                      ><span data-bind="text: title"></span
                    ></a>
                  </li>
                </ul>
              </div>
            </details>
          </div>
          <div
            id="divResponsesSubmitted"
            class="status-set-container"
            title="Click here to View"
            data-bind="visible: arrResponsesSubmittedByAO().length > 0"
          >
            <details>
              <summary class="warning">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div>
                  <span
                    data-bind="text: arrResponsesSubmittedByAO().length"
                  ></span>
                  Responses have been Submitted by the Action Offices
                </div>
              </summary>
              <div id="divResponsesSubmittedItems">
                <ul data-bind="foreach: arrResponsesSubmittedByAO">
                  <li>
                    <a
                      href="javascript:void(0);"
                      title="Go to Request Details"
                      data-bind="click: $root.ClickGoToRequest"
                      ><span data-bind="text: title"></span
                    ></a>
                  </li>
                </ul>
              </div>
            </details>
          </div>
          <div
            id="divRequestsAlmostInternalDue"
            class="status-set-container"
            title="Click here to View"
            data-bind="visible: arrRequestsInternalAlmostDue().length > 0"
          >
            <details>
              <summary class="warning">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div>
                  <span
                    data-bind="text: arrRequestsInternalAlmostDue().length"
                  ></span>
                  Requests are reaching their Internal Due Date
                </div>
              </summary>
              <div id="divRequestsAlmostInternalDueItems">
                <ul data-bind="foreach: arrRequestsInternalAlmostDue">
                  <li>
                    <a
                      href="javascript:void(0);"
                      title="Go to Request Details"
                      data-bind="click: $root.ClickGoToRequest"
                      ><span
                        data-bind="text: title + ' (' + internalDueDate + ')'"
                      ></span
                    ></a>
                  </li>
                </ul>
              </div>
            </details>
          </div>
          <div
            id="divRequestsPastInternalDue"
            class="status-set-container"
            title="Click here to View"
            data-bind="visible: arrRequestsInternalPastDue().length > 0"
          >
            <details>
              <summary class="warning">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div>
                  <span
                    data-bind="text: arrRequestsInternalPastDue().length"
                  ></span>
                  Requests have PASSED their Internal Due Date
                </div>
              </summary>
              <div id="divRequestsPastInternalDueItems">
                <ul data-bind="foreach: arrRequestsInternalPastDue">
                  <li>
                    <a
                      href="javascript:void(0);"
                      title="Go to Request Details"
                      data-bind="click: $root.ClickGoToRequest"
                      ><span
                        data-bind="text: title + ' (' + internalDueDate + ')'"
                      ></span
                    ></a>
                  </li>
                </ul>
              </div>
            </details>
          </div>
          <div
            id="divRequestsAlmostDue"
            class="status-set-container"
            title="Click here to View"
            data-bind="visible: arrRequestsAlmostDue().length > 0"
          >
            <details>
              <summary class="warning">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div>
                  <span data-bind="text: arrRequestsAlmostDue().length"></span>
                  Requests are reaching their Due Date
                </div>
              </summary>
              <div id="divRequestsAlmostDueItems">
                <ul data-bind="foreach: arrRequestsAlmostDue">
                  <li>
                    <a
                      href="javascript:void(0);"
                      title="Go to Request Details"
                      data-bind="click: $root.ClickGoToRequest"
                      ><span
                        data-bind="text: title + ' (' + dueDate + ')'"
                      ></span
                    ></a>
                  </li>
                </ul>
              </div>
            </details>
          </div>
          <div
            id="divRequestsPastDue"
            class="status-set-container"
            title="Click here to View"
            data-bind="visible: arrRequestsPastDue().length > 0"
          >
            <details>
              <summary class="warning">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div>
                  <span data-bind="text: arrRequestsPastDue().length"></span>
                  Requests have PASSED their Due Date
                </div>
              </summary>
              <div id="divRequestsPastDueItems">
                <ul data-bind="foreach: arrRequestsPastDue">
                  <li>
                    <a
                      href="javascript:void(0);"
                      title="Go to Request Details"
                      data-bind="click: $root.ClickGoToRequest"
                      ><span
                        data-bind="text: title + ' (' + dueDate + ')'"
                      ></span
                    ></a>
                  </li>
                </ul>
              </div>
            </details>
          </div>
          <div
            id="divCheckedOutResponseDocs"
            class="status-set-container"
            title="Click here to View"
            data-bind="visible: arrResponseDocsCheckedOut().length > 0"
          >
            <details>
              <summary class="warning">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div>
                  <span
                    data-bind="text: arrResponseDocsCheckedOut().length"
                  ></span>
                  Response Documents are Checked Out
                </div>
              </summary>
              <div id="divCheckedOutResponseDocsItems">
                <ul data-bind="foreach: arrResponseDocsCheckedOut">
                  <li>
                    <a
                      href="javascript:void(0);"
                      title="Go to Request Details"
                      data-bind="click: $root.ClickGoToRequest"
                      ><span data-bind="text: title"></span
                    ></a>
                  </li>
                </ul>
              </div>
            </details>
          </div>
          <div
            id="divResponsesReadyToClose"
            class="status-set-container"
            title="Click here to View"
            data-bind="visible: arrResponsesReadyToClose().length > 0"
          >
            <details>
              <summary class="warning">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div>
                  <span
                    data-bind="text: arrResponsesReadyToClose().length"
                  ></span>
                  Responses are Ready to Close
                </div>
              </summary>
              <div id="divResponsesReadyToCloseItems">
                <ul data-bind="foreach: arrResponsesReadyToClose">
                  <li>
                    <a
                      href="javascript:void(0);"
                      title="Go to Request Details"
                      data-bind="click: $root.ClickGoToRequest"
                      ><span data-bind="text: title"></span
                    ></a>
                  </li>
                </ul>
              </div>
            </details>
          </div>
          <div
            id="divResponsesWithUnsubmittedResponsDocs"
            class="status-set-container"
            data-bind="visible: arrResponsesWithUnsubmittedResponseDocs().length > 0"
          >
            <details>
              <summary class="warning btn btn-link">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div>
                  <span
                    data-bind="text: arrResponsesWithUnsubmittedResponseDocs().length"
                  ></span>
                  Responses have Unsubmitted Response Documents
                </div>
              </summary>
              <div id="divResponsesWithUnsubmittedResponseDocsItems">
                <table class="tablesorter">
                  <thead>
                    <tr>
                      <!-- <th>Response ID</th> -->
                      <th>Title</th>
                      <th>Modified</th>
                    </tr>
                  </thead>
                  <tbody
                    data-bind="foreach: arrResponsesWithUnsubmittedResponseDocs"
                  >
                    <tr>
                      <td colspan="2">
                        <span
                          title="Go to Response Details"
                          class="btn btn-link fw-semibold primary"
                          data-bind="text: title + ' (' + unsubmittedDocs.length + ' documents)', 
                        click: $root.ClickGoToRequest"
                        ></span>
                      </td>
                    </tr>
                    <!-- ko foreach: unsubmittedDocs -->
                    <tr>
                      <td>
                        <a
                          title="Click to Download"
                          data-bind="text: fileName, downloadLink: '../_layouts/download.aspx?SourceUrl=:folder/:fileName'"
                        ></a>
                      </td>
                      <td data-bind="text: modifiedDate"></td>
                    </tr>
                    <!-- /ko -->
                  </tbody>
                </table>
              </div>
            </details>
          </div>
          <div
            id="divRequestsWithNoResponse"
            class="status-set-container"
            title="Click here to View"
            data-bind="visible: arrRequestsWithNoResponses().length > 0"
          >
            <details>
              <summary class="warning btn btn-link">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div>
                  <span
                    data-bind="text: arrRequestsWithNoResponses().length"
                  ></span>
                  Requests have 0 Responses
                </div>
              </summary>
              <div id="divRequestsWithNoResponseItems" class="">
                <ul data-bind="foreach: arrRequestsWithNoResponses">
                  <li>
                    <a
                      href="javascript:void(0);"
                      title="Go to Request Details"
                      data-bind="click: $root.ClickGoToRequest"
                      ><span data-bind="text: title"></span
                    ></a>
                  </li>
                </ul>
              </div>
            </details>
          </div>
        </div>
      </div>
      <div class="reports-container">
        <div class="quick-links">
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
              title="View User Manuals"
              href="javascript:void(0)"
              onclick="Audit.Common.Utilities.ViewUserManuals()"
              ><span class="ui-icon ui-icon-help"></span>User Manuals</a
            >
          </div>
          <div>
            <a
              title="View Response Documents Uploaded by Action Offices Today but not yet Submitted"
              href="javascript:void(0)"
              onclick="Audit.IAReport.Report.ViewResponseDocsToday()"
              ><span class="ui-icon ui-icon-search"></span>View Today's
              Un-submitted Response Documents</a
            >
          </div>
          <div>
            <a
              title="View Response Documents Returned to GFS"
              href="javascript:void(0)"
              onclick="Audit.IAReport.Report.ViewReturnedDocs()"
              ><span class="ui-icon ui-icon-search"></span>View Response
              Documents Returned to GFS</a
            >
          </div>
          <div>
            <a
              title="View Request, Response and Site Permissions"
              href="javascript:void(0)"
              onclick="Audit.IAReport.Report.ViewPermissions()"
              ><span class="ui-icon ui-icon-locked"></span>View Permissions</a
            >
          </div>
          <div>
            <a
              title="View Late Requests"
              href="javascript:void(0)"
              onclick="Audit.IAReport.Report.ViewLateRequests()"
              ><span class="ui-icon ui-icon-clock"></span>View Late Requests</a
            >
          </div>
          <div>
            <a
              id="linkSubmitBulkReq"
              href="javascript:void(0)"
              data-bind="click: ClickBulkAddRequest"
              ><span class="ui-icon ui-icon-plus"></span>Bulk Add Request</a
            >
          </div>
          <div>
            <a
              id="linkSubmitNewReq"
              href="javascript:void(0)"
              data-bind="click: ClickNewRequest"
              ><span class="ui-icon ui-icon-plus"></span>Create a New Request</a
            >
          </div>
          <div style="display: none">
            <a
              id="linkResetPerms"
              href="javascript:void(0)"
              data-bind="click: ClickResetPerms"
              ><span class="ui-icon ui-icon-locked"></span>Reset App
              Permissions</a
            >
          </div>
        </div>
        <div id="tabs" style="margin-top: 20px">
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
    <div
      id="divRanBulkUpdate"
      title="Do not delete Used for checking if bulk update ran"
      style="display: none"
    ></div>
  </div>

  <script id="requestStatusReportTemplate" type="text/html">
    <div id="divStatusReportRequests">
      <table
        is="data-table"
        id="tblStatusReportRequests"
        data-title="Request Status Report"
        data-file-prefix="RequestStatusReport_"
        class="tablesorter report"
      >
        <thead>
          <tr
            valign="top"
            class="rowFilters"
            data-bind="visible: arrRequests().length > 0"
          >
            <th
              class="sorter-false filter"
              data-filter="search"
              data-filter-prop="ID"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false"
              data-filter="search"
              data-filter-prop="subject"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false"
              data-filter="multiselect"
              data-filter-prop="requestingOffice"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false filter"
              data-filter="multiselect"
              data-filter-prop="sensitivity"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false filter"
              data-filter="multiselect"
              data-filter-value="Open"
              data-filter-prop="status"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false"
              data-filter="daterange"
              data-filter-prop="internalDueDate"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false filter"
              data-filter="daterange"
              data-filter-prop="dueDate"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false filter"
              data-filter="multiselect"
              data-filter-prop="sample"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false filter"
              data-filter="multiselect"
              data-filter-prop="sentEmail"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false filter"
              data-filter="search"
              data-filter-prop="(r) => r.actionOffices.map(ao => ao.ao)"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false"
              data-filter="multiselect"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false"
              data-filter="multiselect"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false"
              data-filter="multiselect"
              nowrap="nowrap"
            ></th>
          </tr>
          <tr valign="top">
            <th class="sorter-true" nowrap="nowrap">Request #</th>
            <th class="sorter-true" nowrap="nowrap">Subject</th>
            <th class="sorter-true" nowrap="nowrap">Requesting Office</th>
            <th class="sorter-true" nowrap="nowrap">Sensitivity</th>
            <th class="sorter-true" nowrap="nowrap">Status</th>
            <th class="sorter-true desc" nowrap="nowrap">Internal Due Date</th>
            <th class="sorter-true" nowrap="nowrap">Due Date</th>
            <th class="sorter-true" nowrap="nowrap">Sample?</th>
            <th class="sorter-true" nowrap="nowrap">Sent Email?</th>
            <th class="sorter-false" nowrap="nowrap">Action Office(s)</th>
            <th class="sorter-true" nowrap="nowrap"># of Responses</th>
            <th class="sorter-true" nowrap="nowrap"># of Open Responses</th>
            <th class="sorter-true" nowrap="nowrap"># of Documents</th>
          </tr>
        </thead>
        <tbody id="fbody1" data-bind="foreach: arrRequests">
          <tr class="sr1-request-item">
            <td class="sr1-request-requestNum">
              <a
                href="javascript:void(0);"
                title="Go to Request Details"
                data-bind="text: reqNumber,
                  click: () => Audit.IAReport.Report.GoToRequest(reqNumber, null)"
              ></a>
            </td>
            <td class="sr1-request-subject" data-bind="text: subject"></td>
            <td
              class="sr1-request-requestingOffice"
              data-bind="text: requestingOffice"
            ></td>
            <td
              class="sr1-request-sensitivity"
              data-bind="text: sensitivity"
            ></td>
            <td class="sr1-request-status" data-bind="text: status"></td>
            <td
              class="sr1-request-internalDueDate"
              data-bind="text: internalDueDate,
                class: internalDueDateStyle"
            ></td>
            <td
              class="sr1-request-dueDate"
              data-bind="text: dueDate,
                class: dueDateStyle"
            ></td>
            <td class="sr1-request-sample">
              <span
                class="ui-icon"
                data-bind="class: sample ? 'ui-icon-check' : 'ui-icon-close',
                text: sample ?? 'false'"
              ></span>
            </td>
            <td class="sr1-request-sentEmail">
              <span
                class="ui-icon"
                data-bind="class: sentEmail ? 'ui-icon-check' : 'ui-icon-close',
                text: sentEmail ?? 'false'"
              ></span>
            </td>
            <td class="sr1-request-actionOffice">
              <div
                style="cursor:pointer; white-space:nowrap"
                title="Click to view"
              >
                <span class="actionOfficeContainer">
                  <span class="ui-icon ui-icon-search"></span
                  ><a
                    href="javascript:void(0)"
                    data-bind="click: $parent.clickExpandActionOffices"
                    >View Action Offices</a
                  >
                  <ul class="sr1-request-actionOffice-items collapsed">
                    <!-- ko foreach: actionOffices -->
                    <li class="sr1-request-actionOffice-item">
                      <span data-bind="text: ao"></span>;
                    </li>
                    <!-- /ko -->
                  </ul>
                </span>
              </div>
            </td>
            <td
              class="sr1-request-responseCount"
              data-bind="text: responseCount"
            ></td>
            <td
              class="sr1-request-responsesOpenCount"
              data-bind="text: responsesOpenCount"
            ></td>
            <td
              class="sr1-request-responseDocCount"
              data-bind="text: responseDocCount"
            ></td>
          </tr>
        </tbody>
      </table>
    </div>
  <\/script>

  <script id="responseStatusReportTemplate" type="text/html">
    <div id="divStatusReportRespones">
      <table
        id="tblStatusReportResponses"
        is="data-table"
        data-title="Response Status Report"
        data-file-prefix="ResponseStatusReport_"
        class="tablesorter report"
        data-bind="visible: arrResponses().length > 0"
      >
        <thead>
          <tr
            valign="top"
            class="rowFilters"
            data-bind="visible: arrResponses().length > 0"
          >
            <th
              class="sorter-false"
              data-filter="multiselect"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false"
              data-filter="multiselect"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false"
              data-filter="multiselect"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false"
              data-filter="daterange"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false"
              data-filter="multiselect"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false"
              data-filter="multiselect"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false"
              data-filter="multiselect"
              nowrap="nowrap"
            ></th>
            <th
              class="sorter-false"
              data-filter="daterange"
              nowrap="nowrap"
            ></th>
          </tr>
          <tr valign="top">
            <th class="sorter-true asc" nowrap="nowrap">Request #</th>
            <th class="sorter-true" nowrap="nowrap">Sample #</th>
            <th class="sorter-true" nowrap="nowrap">Response Name</th>
            <th class="sorter-true" nowrap="nowrap">Internal Due Date</th>
            <th class="sorter-true" nowrap="nowrap">Status</th>
            <th class="sorter-true" nowrap="nowrap">Action Office</th>
            <th class="sorter-true" nowrap="nowrap"># of Documents</th>
            <th class="sorter-true" nowrap="nowrap">Modified</th>
          </tr>
        </thead>
        <tbody id="fbody2" data-bind="foreach: arrResponses">
          <tr class="sr2-response-item">
            <td class="sr2-response-requestNum">
              <a
                href="javascript:void(0);"
                title="Go to Request Details"
                data-bind="click: () => Audit.IAReport.Report.GoToRequest(reqNumber, title),
          text: reqNumber"
              ></a>
            </td>
            <td class="sr2-response-sample" data-bind="text: sample"></td>
            <td class="sr2-response-title" data-bind="text: title"></td>
            <td
              class="sr2-response-internalDueDate"
              data-bind="text: internalDueDate"
            ></td>
            <td class="sr2-response-status" data-bind="text: status"></td>
            <td class="sr2-response-ao" data-bind="text: ao"></td>
            <td class="sr2-response-docCount" data-bind="text: docCount"></td>
            <td class="sr2-response-modified" data-bind="text: modified"></td>
          </tr>
        </tbody>
        <tfoot class="footer"></tfoot>
      </table>
    </div>
  <\/script>

  <script id="requestDetailTemplate" type="text/html">
    <div class="quick-links secondary">
      <span>Request: </span
      ><select
        id="ddlReqNum"
        title="Select a Request Number"
        data-bind="options: $root.ddOptionsRequestInfoTabRequestName, value: filterRequestInfoTabRequestName, optionsCaption: '-Select-'"
      ></select>
    </div>
    <div
      data-bind="component: {name: requestDetailViewComponent.componentName, params: requestDetailViewComponent}"
    ></div>
  <\/script>

  <script id="requestTemplate" type="text/html"><\/script>

  <!-- New Request Detail tab, uses the  -->
  <script id="newRequestTemplate" type="text/html">
    <div data-bind="component: {name: componentName, params: params}"></div>
  <\/script>

  <div id="divTest"></div>
`])));window.Audit=window.Audit||{};Audit.Common=Audit.Common||{};function na(){Audit.Common.Utilities=new Audit.Common.NewUtilities,Audit.Common.Init()}Audit.Common.Init=function(){};Audit.Common.NewUtilities=function(){var t=_spPageContextInfo.webServerRelativeUrl,e="AuditRequests",s="AuditRequests",n="AuditRequestsInternal",o="AuditRequestsInternal",r="AuditResponses",a="AuditResponses",l="AuditRequestDocs",u="AuditRequestDocs",d="AuditCoverSheets",m="AuditCoverSheets",p="AuditResponseDocs",g="AuditResponseDocs",b="AuditResponseDocsEA",h="AuditResponseDocsEA",S="AuditOrganizations",A="AuditOrganizations",w="AuditEmails",D="AuditEmails",k="AuditBulkResponses",G="AuditBulkResponses",Q="AuditBulkPermissions",L="AuditBulkPermissions",W="CGFS Special Access1",Y="CGFS Special Access2",N="Quality Assurance",V="External Auditors",B=null,X=null,U=null;function ie(c=!1){if(c){location.href=location.pathname;return}var f=location.pathname;if($("#tabs").html()!=null&&$("#tabs").html()!=""){var y=0;try{y=$("#tabs").tabs("option","active")}catch{}if(f+="?Tab="+y,y==0&&$("#ddlResponseName").val()!="")f+="&ResNum="+$("#ddlResponseName").val();else if(y==1){var P=$("#ddlResponsesOpen").val(),O=$("#ddlResponsesProcessed").val();P!=null&&P!=""?f+="&ResNum="+P:O!=null&&O!=""&&(f+="&ResNum="+O)}location.href=f}else location.reload()}function re(){var c=new Date;$("#divLoading").text("Loaded at "+c.format("MM/dd/yyyy hh:mm tt"))}function ye(){var c=GetUrlKeyValue("Tab");c!=null&&c!=""&&$("#tabs").tabs("option","active",c);var f=!1,y=GetUrlKeyValue("ResNum");y!=null&&y!=""&&(c==0?$("#ddlResponseName option[value='"+y+"']").length>0&&($("#ddlResponseName").val(y).change(),f=!0):$("#ddlResponsesOpen option[value='"+y+"']").length>0?$("#ddlResponsesOpen").val(y).change():$("#ddlResponsesProcessed option[value='"+y+"']").length>0&&$("#ddlResponsesProcessed").val(y).change()),f||$(".sr-response-item").show()}function ae(c,f){var y=0,P=0,O=0,Z=0,z=0,le=$(".sr-response-item");le.each(function(){var De=$.trim($(this).find(".sr-response-requestStatus").text()),Ee=$.trim($(this).find(".sr-response-status").text());(Ee==c||Ee==f)&&(De=="Open"||De=="ReOpened")&&($(this).addClass("highlighted"),y++,Ee==c?Z++:Ee==f&&z++,De=="Open"?P++:De=="ReOpened"&&O++)}),y>0?($("#lblStatusReportResponsesMsg").html("<span class='ui-icon ui-icon-alert'></span>There are "+y+" Responses pending your review"),Z>0&&z==0?$("#ddlResponseStatus").val(c).change():z>0&&Z==0&&$("#ddlResponseStatus").val(f).change()):$("#lblStatusReportResponsesMsg").html("<span class='ui-icon ui-icon-circle-check'></span>There are 0 Responses pending your review")}function lt(c){X=new Array;for(var f=c.getEnumerator();f.moveNext();){var y=f.get_current(),P=y.get_id(),O=y.get_loginName(),Z=y.get_title(),z=new Object;z.ID=P,z.loginName=O,z.title=Z,z.group=y,X.push(z)}}function oe(c){var f=null;if(X!=null){for(var y=0;y<X.length;y++)if(X[y].title==c){f=X[y].group;break}}return f}function Ae(c){U=new Array;for(var f=c.getEnumerator();f.moveNext();){var y=f.get_current(),P=y.get_item("ID"),O=y.get_item("Title"),Z=y.get_item("UserGroup");Z!=null?Z=Z.get_lookupValue():Z="";var z=new Object;z.ID=P,z.title=O,z.userGroup=Z,U.push(z)}}function be(c){var f=null;if(U!=null)for(var y=0;y<U.length;y++){var P=U[y];if(P.title==c){f=P.userGroup;break}}return f}function qe(c,f,y){if(c==null||f==""||f==null||y==null)return!1;var P=!1,O=c.get_roleAssignments();if(O==null)return alert("Error retrieving role assignments"),!1;for(var Z=O.getEnumerator();Z.moveNext();){var z=Z.get_current();if(z!=null){var le=z.get_member();if(le.isPropertyAvailable("Title")){var De=le.get_title(),Ee=z.get_roleDefinitionBindings();if(Ee!=null)for(var rt=Ee.getEnumerator();rt.moveNext();){var tt=rt.get_current(),dt=tt.get_name();if(De==f&&tt.get_basePermissions().has(y)){P=!0;break}}}}}return P}function vt(c,f){if(!f){var y=!1;$("#ddlResponsesOpen > option").each(function(){if($(this).text()==c)return y=!0,notifyId=SP.UI.Notify.addNotification("Displaying Response ("+c+")",!1),$("#ddlResponsesOpen").val(c).change(),!1}),y||$("#ddlResponsesProcessed > option").each(function(){if($(this).text()==c)return y=!0,notifyId=SP.UI.Notify.addNotification("Displaying Response ("+c+")",!1),$("#ddlResponsesProcessed").val(c).change(),!1}),$("#tabs").tabs({active:1})}}function Ft(c){var f={};return c=="Archived"?f={"background-color":"Gainsboro"}:c=="Approved"?f={"background-color":"PaleGreen"}:c=="Rejected"?f={"background-color":"LightSalmon"}:c=="Sent to QA"?f={"background-color":"LightCyan"}:c=="Submitted"?f={"background-color":"LemonChiffon"}:c=="Marked for Deletion"&&(f={"background-color":"Gainsboro","font-style":"italic"}),f}function $t(c){var f="";return c=="Archived"?f=" style='background-color:Gainsboro;' ":c=="Approved"?f=" style='background-color:PaleGreen;' ":c=="Rejected"?f=" style='background-color:LightSalmon;' ":c=="Sent to QA"?f=" style='background-color:LightCyan;' ":c=="Submitted"?f=" style='background-color:LemonChiffon;' ":c=="Marked for Deletion"&&(f=" style='background-color:Gainsboro; font-style:italic' title='Marked for Deletion by the Action Office' "),f}function Ht(c,f){for(var y=!1,P=c.getEnumerator();P.moveNext();){var O=P.get_current(),Z=O.get_displayName();if(Z==f){var y=!0;break}}return y}var Nt=0,ot=0;function Me(c,f,y,P){Nt=0,ot=0;var O=new SP.ClientContext.get_current,Z=O.get_web(),z=new SP.ListItemCreationInformation;z.set_underlyingObjectType(SP.FileSystemObjectType.folder),z.set_leafName(f),oNewEmailFolder=c.addItem(z),oNewEmailFolder.set_item("Title",f),oNewEmailFolder.update(),this.currentUser=Z.get_currentUser(),this.ownerGroup=Z.get_associatedOwnerGroup(),this.memberGroup=Z.get_associatedMemberGroup(),this.visitorGroup=Z.get_associatedVisitorGroup(),oNewEmailFolder.resetRoleInheritance(),oNewEmailFolder.breakRoleInheritance(!1,!1);var le=SP.RoleDefinitionBindingCollection.newObject(O);le.add(Z.get_roleDefinitions().getByType(SP.RoleType.administrator));var De=SP.RoleDefinitionBindingCollection.newObject(O);De.add(Z.get_roleDefinitions().getByType(SP.RoleType.contributor));var Ee=SP.RoleDefinitionBindingCollection.newObject(O);Ee.add(Z.get_roleDefinitions().getByName("Restricted Read"));var rt=SP.RoleDefinitionBindingCollection.newObject(O);rt.add(Z.get_roleDefinitions().getByName("Restricted Contribute")),oNewEmailFolder.get_roleAssignments().add(ownerGroup,le),oNewEmailFolder.get_roleAssignments().add(memberGroup,De),oNewEmailFolder.get_roleAssignments().add(visitorGroup,Ee);var tt=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameQA());tt!=null&&oNewEmailFolder.get_roleAssignments().add(tt,rt),oNewEmailFolder.get_roleAssignments().getByPrincipal(currentUser).deleteObject();function dt(){if(this.requestItem){var st=this.requestItem.get_item("ActionOffice");if(st==null||st.length==0){this.OnComplete&&this.OnComplete(!0);return}for(var Kt=0;Kt<st.length;Kt++){var Zr=st[Kt].get_lookupValue(),ea=Audit.Common.Utilities.GetAOSPGroupName(Zr),vn=Audit.Common.Utilities.GetSPSiteGroup(ea);if(vn!=null){let yn=function(){ot++,ot==Nt&&this.OnComplete&&this.OnComplete(!0)},wn=function(gu,hu){ot++,ot==Nt&&this.OnComplete&&this.OnComplete(!0)};var pu=yn,fu=wn;Nt++;var Pi=new SP.ClientContext.get_current,ta=Pi.get_web(),bn=SP.RoleDefinitionBindingCollection.newObject(Pi);bn.add(ta.get_roleDefinitions().getByName("Restricted Contribute")),this.oNewEmailFolder.get_roleAssignments().add(vn,bn);var Rn={OnComplete:this.OnComplete};Pi.executeQueryAsync(Function.createDelegate(Rn,yn),Function.createDelegate(Rn,wn))}}}else this.OnComplete&&this.OnComplete(!0)}function yt(st,Kt){statusId=SP.UI.Status.addStatus("Request failed: "+Kt.get_message()+`
`+Kt.get_stackTrace())}var Dt={requestItem:y,oNewEmailFolder,OnComplete:P};O.executeQueryAsync(Function.createDelegate(Dt,dt),Function.createDelegate(Dt,yt))}function Te(c,f){var y=c,P=f;let O,Z;y==null&&(y=""),P==null&&(P="");var z=y.lastIndexOf("-");if(z>=0){var le=y.substring(0,z+1),De=y.replace(le,""),Ee=parseInt(De,10),rt=Audit.Common.Utilities.PadDigits(Ee,5);O=le+rt}else O=y;var tt=P.lastIndexOf("-");if(tt>=0){var dt=P.substring(0,tt+1),yt=P.replace(dt,""),Dt=parseInt(yt,10),st=Audit.Common.Utilities.PadDigits(Dt,5);Z=dt+st}else Z=P;return O.toLowerCase().localeCompare(Z.toLowerCase())}function Ot(c,f){var y=c.title,P=f.title,O,Z;y==null&&(y=""),P==null&&(P="");var z=y.lastIndexOf("-");if(z>=0){var le=y.substring(0,z+1),De=y.replace(le,""),Ee=parseInt(De,10),rt=Audit.Common.Utilities.PadDigits(Ee,5);O=le+rt}else O=y;var tt=P.lastIndexOf("-");if(tt>=0){var dt=P.substring(0,tt+1),yt=P.replace(dt,""),Dt=parseInt(yt,10),st=Audit.Common.Utilities.PadDigits(Dt,5);Z=dt+st}else Z=P;return O.toLowerCase().localeCompare(Z.toLowerCase())}function cs(c,f){return c.toLowerCase().localeCompare(f.toLowerCase())}function ut(c,f){return c==""?-1:f==""?1:new Date(c).getTime()-new Date(f).getTime()}function jt(c,f,y,P){if(c!=null){P?c.sort(Te):y?c.sort(ut):c.sort(cs);var O=new Array,Z=-1;O[++Z]="<option value=''>-Select-</option>";for(var z=c.length,le=0;le<z;le++){var De=$.trim(c[le]);O[++Z]="<option value='"+De+"'>"+De+"</option>"}var Ee=$(f);Ee.empty().append(O.join(""))}}function Qe(c,f){if(c==null)return!1;for(var y=c.length,P=0;P<y;P++)if(c[P]==f)return!0;return!1}function Wt(c){return c==!0?"<span class='ui-icon ui-icon-check'>"+c+"</span>":"<span class='ui-icon ui-icon-close'>"+c+"</span>"}function Ti(c,f){var y=c.get_item(f);return y==null?"":y.get_lookupValue()}function Ii(c,f){c=c.toString();var y="";if(f>c.length)for(let P=0;P<f-c.length;P++)y+="0";return y+c.toString()}function gn(c,f){var y=c>=0?1:-1;return(Math.round(c*Math.pow(10,f)+y*.001)/Math.pow(10,f)).toFixed(f)}function hn(c){return c==null||c==""?"":(c>1048576?c=Audit.Common.Utilities.PreciseRound(c/1048576,2)+" MB":c>1024?c=Audit.Common.Utilities.PreciseRound(c/1024,2)+" KB":c+=" B",c)}function v(c){function f(y){return y<10?"0"+y:y}return c.getUTCFullYear()+"-"+f(c.getUTCMonth()+1)+"-"+f(c.getUTCDate())+"T"+f(c.getUTCHours())+":"+f(c.getUTCMinutes())+":"+f(c.getUTCSeconds())+"Z"}function R(){$(".requestInfo-response-doc img").click(function(c){c.preventDefault();var f=$(this).attr("src");f=="/_layouts/images/minus.gif"?$(this).attr("src","/_layouts/images/plus.gif"):$(this).attr("src","/_layouts/images/minus.gif"),$(this).parent().parent().nextUntil("tr.requestInfo-response-doc").each(function(){$(this).toggleClass("collapsed")})})}function C(c){return $("select[title='"+c+"']").html()!==null?$("select[title='"+c+"']"):$("input[title='"+c+"']")}function _(c){return $("select[title='"+c+"']").html()!==null?$("select[title='"+c+"'] option:selected").text():$("input[title='"+c+"']").val()}function x(c,f){try{if(f==null)return;var y=F("select","",c);if(y==null){var P=F("input","",c);ShowDropdown(P.id);var O=document.getElementById(P.opt);q(O,f),OptLoseFocus(O)}else q(y,f)}catch{}}function q(c,f){var y=c.options,P=y.length;if(c!=null){for(var O=0;O<P;O++)if(y[O].text==f)return c.selectedIndex=O,!0;return!1}}function F(c,f,y){for(var P=f.length,O=document.getElementsByTagName(c),Z=0;Z<O.length;Z++){var z=O[Z].id;if(O[Z].title==y&&(f==""||z.indexOf(f)==z.length-P))return O[Z]}return null}function I(c){var f=SP.UI.$create_DialogOptions();f.title="User Manual",f.height=250,c!=null?f.url=Audit.Common.Utilities.GetSiteUrl()+"/pages/AuditUserManuals.aspx?FilterField1=DocType&FilterValue1="+c:f.url=Audit.Common.Utilities.GetSiteUrl()+"/pages/AuditUserManuals.aspx",SP.UI.ModalDialog.showModalDialog(f)}function K(c,f){var y=new Date,P=Audit.Common.Utilities.GetSiteUrl(),O=P+"/siteassets/css/tablesorter/style.css?v="+y.format("MM_dd_yyyy"),Z=P+"/siteAssets/css/audit_styles.css?v="+y.format("MM_dd_yyyy"),z=$(f).html(),le=$("<div>").append(z);le.find(".sr-response-title a").each(function(){$(this).removeAttr("onclick"),$(this).removeAttr("href")}),z=le.html();var De=y.format("MM/dd/yyyy hh:mm tt");De="<div style='padding-bottom:10px;'>"+De+"</div>",z=De+z;var Ee=$("<div></div>"),rt=$("<div></div>"),tt=$.Deferred(),dt=$.Deferred(),yt="";Ee.load(O,function(){yt+="<style>"+Ee.html()+"</style>",tt.resolve()}),rt.load(Z,function(){yt+="<style>"+rt.html()+"</style>",dt.resolve()}),$.when(tt,dt).done(function(){var Dt=`<HTML>
<HEAD>

<Title>`+c+`</Title>
`+yt+`
<style>.hideOnPrint, .rowFilters {display:none}</style>
</HEAD>
<BODY>
`+z+`
</BODY>
</HTML>`,st=window.open("","printWebPart");st.document.open(),st.document.write(Dt),st.document.close(),st.print()})}function H(c,f,y){var P=E(f);y==!0&&(P=P.slice(1));var O=M(P);if(navigator.userAgent.search("Trident")>=0)window.CsvExpFrame.document.open("text/html","replace"),window.CsvExpFrame.document.write(O),window.CsvExpFrame.document.close(),window.CsvExpFrame.focus(),window.CsvExpFrame.document.execCommand("SaveAs",!0,c+".csv");else{var Z="data:text/csv;charset=utf-8,"+escape(O),z=document.createElement("a");z.href=Z,z.download=c+".csv",document.body.appendChild(z),z.click(),document.body.removeChild(z)}}function E(c){var f=document.getElementById(c);if(f.innerHTML.indexOf("rowFilters")>=0){var y=$("<div>").append(f.outerHTML);y.find(".rowFilters").each(function(){$(this).remove()}),f=y.find("table")[0]}if(f.innerHTML.indexOf("footer")>=0){var y=$("<div>").append(f.outerHTML);y.find(".footer").each(function(){$(this).remove()}),f=y.find("table")[0]}for(var P=[],O=0,Z=f.rows.length;O<Z;O++){P[O]=[];for(var z=0,le=f.rows[O].cells.length;z<le;z++){var De=f.rows[O].cells[z].textContent||f.rows[O].cells[z].innerText;P[O][z]=De.trim()}}return P}function M(c){for(var f=typeof c!="object"?JSON.parse(c):c,y=`sep=,\r
`,P="",O,Z,z=0;z<f.length;z++){P="";var le=f[z];for(O in le)le.hasOwnProperty(O)&&(Z=le[O]+"",P+='"'+Z.replace(/"/g,'""')+'",');P=P.slice(0,-1),y+=P+`\r
`}return y}var J={GetSiteUrl:function(){return t=="/"?"":t},GetListTitleRequests:function(){return e},GetListNameRequests:function(){return s},GetListTitleRequestsInternal:function(){return n},GetListNameRequestsInternal:function(){return o},GetListTitleResponses:function(){return r},GetListNameResponses:function(){return a},GetLibTitleRequestDocs:function(){return l},GetLibNameRequestDocs:function(){return u},GetLibTitleCoverSheets:function(){return d},GetLibNameCoverSheets:function(){return m},GetLibTitleResponseDocs:function(){return p},GetLibNameResponseDocs:function(){return g},GetLibTitleResponseDocsEA:function(){return b},GetLibNameResponseDocsEA:function(){return h},GetListTitleActionOffices:function(){return S},GetListNameActionOffices:function(){return A},GetListTitleEmailHistory:function(){return w},GetListNameEmailHistory:function(){return D},GetListTitleBulkResponses:function(){return k},GetListNameBulkResponses:function(){return G},GetListTitleBulkPermissions:function(){return Q},GetListNameBulkPermissions:function(){return L},GetGroupNameSpecialPerm1:function(){return W},GetGroupNameSpecialPerm2:function(){return Y},GetGroupNameQA:function(){return N},GetGroupNameEA:function(){return V},Refresh:ie,OnLoadDisplayTimeStamp:re,OnLoadDisplayTabAndResponse:ye,OnLoadFilterResponses:function(c,f){ae(c,f)},SetResponseDocLibGUID:function(c){B=c},GetResponseDocLibGUID:function(){return B},LoadSiteGroups:function(c){lt(c)},GetSPSiteGroup:function(c){return oe(c)},LoadActionOffices:function(c){Ae(c)},GetActionOffices:function(){return U},GetAOSPGroupName:function(c){return be(c)},CheckSPItemHasGroupPermission:function(c,f,y){return qe(c,f,y)},GoToResponse:function(c,f){vt(c,f)},GetResponseDocStyleTag:function(c){return $t(c)},GetResponseDocStyleTag2:function(c){return Ft(c)},CheckIfEmailFolderExists:function(c,f){return Ht(c,f)},CreateEmailFolder:function(c,f,y,P){return Me(c,f,y,P)},AddOptions:function(c,f,y,P){jt(c,f,y,P)},ExistsInArr:function(c,f){return Qe(c,f)},GetTrueFalseIcon:function(c){return Wt(c)},PadDigits:function(c,f){return Ii(c,f)},PreciseRound:function(c,f){return gn(c,f)},GetFriendlyFileSize:function(c){return hn(c)},GetISODateString:function(c){return v(c)},GetFriendlyDisplayName:function(c,f){return Ti(c,f)},BindHandlerResponseDoc:R,PrintStatusReport:function(c,f){K(c,f)},ExportToCsv:function(c,f,y){H(c,f,y)},ViewUserManuals:function(c){I(c)},GetLookupDisplayText:function(c){return _(c)},GetLookupFormField:function(c){return C(c)},SetLookupFromFieldNameByText:function(c,f){return x(c,f)},SortResponseObjects:function(c,f){return Ot(c,f)},SortResponseTitles:Te};return J};na();var oa=String.raw,_n=oa`
  <div>
    <!-- Hide the element, stylesheet overrides on load -->
    <style>
        .search-group {
        --font-sm: 0.75rem;
        }

        /* Testing Style HTML Elements */
        .elements-container {
        display: flex;
        column-gap: 20px;
        }
        .select-container {
        width: 150px;
        }

        /* Actual Elements */

        div.search-group {
        display: revert;
        position: relative;
        min-height: 1rem;
        }

        .search-input-group {
        display: flex;
        align-items: center;
        background-color: white;
        /* border: 1px solid lightgray; */
        border: none;
        border-radius: 4px;
        box-sizing: border-box;
        padding: 0;
        }

        .search-input-group input {
        border: none;
        border-radius: 4px;
        width: 100%;
        color: black;
        padding: 0.1rem 0.3rem;
        font-size: var(--font-sm);
        font-family: "Segoe UI";
        }

        /* .caret {
        content: "";
        display: inline-block;
        border: 4px solid transparent;
        border-top-color: transparent;
        border-top-color: black;
        margin-left: 12px;
        margin-top: 4px;
        } */

        .caret-bg {
        background-image: url("#svg-caret-down");
        background-repeat: no-repeat;
        min-width: 1rem;
        }

        .search-input-group::after {
        aspect-ratio: 1 / 1;
        height: 1rem;
        content: "\276F";
        color: darkgray;
        font-size: 0.7rem;
        font-weight: bold;
        text-align: center;
        display: flex;
        justify-content: center;
        transition: transform 0.4s ease-in-out;
        }

        .search-group.active .search-input-group::after {
        transform: rotate(90deg);
        }

        .search-input-group .vertical-spacer {
        height: 85%;
        min-height: 0.8rem;
        border-left: 1px solid lightGray;
        }
        .search-input-group svg {
        color: lightGray;
        height: 85%;
        transition-duration: 0.5s;
        }

        .search-group.active .search-input-group svg {
        border: none;
        transform: rotate(180deg);
        }

        .hidden {
        display: none;
        }

        .secondary {
        font-style: italic;
        }

        .test-toggle {
        background-color: green;
        }

        .selected.item {
        display: flex;
        align-items: center;
        width: fit-content;
        color: #212529;
        font-weight: normal;
        font-size: var(--font-sm);
        background-color: #f8f9fa;
        border-radius: 0.25rem;
        border: 1px solid #dee2e6;
        /* height: 1.5rem; */
        /* top right bottom left */
        /* padding: 0.1rem 0rem 0.1rem 0.5rem; */
        padding-left: 0.75rem;
        margin-bottom: 1px;
        }

        .selected.item div.remove {
        /* border-style: none;
        border-radius: 50%; */
        border-top-right-radius: 0.25rem;
        border-bottom-right-radius: 0.25rem;
        margin-left: 0.4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 1rem;
        color: rgb(108, 117, 125);
        aspect-ratio: 1/1;
        }

        .selected.item div.remove:hover {
        background-color: darkgrey;
        color: white;
        }

        .selected.item div.remove svg {
        height: 1.25rem;
        width: 1.25rem;
        }

        .filtered.item {
        background-color: white;
        padding: 0.1rem 1rem;
        font-weight: normal;
        }

        .filtered.item.even {
        background-color: rgb(233, 233, 233);
        }

        .filtered.item:hover {
        background-color: lightgray;
        }

        .filtered.item.active {
        background-color: lightblue;
        }

        #selected-items-text {
        display: flex;
        flex-wrap: wrap;
        }

        .filtered-items {
        color: black;
        list-style: none;
        padding-left: 0;
        margin-top: 3px;
        /* display: none; */
        position: absolute;
        min-width: 100%;
        max-height: 0px;
        overflow-y: auto;
        z-index: 1;
        border: 0px solid lightgray;
        box-sizing: border-box;
        transition: all 0.4s ease-in-out;
        }

        .filtered-items.active {
        /* display: block; */
        max-height: 200px;
        border: 1px solid lightgray;
        }

      .search-group {
        display: none;
      }
    </style>
    <div id="search-group" class="search-group" tabindex="-1">
      <div id="selected-items-text"></div>
      <div class="search-input-group" tabindex="-1">
        <input
          id="search-input"
          class="search-input"
          placeholder="Search..."
          type="text"
          autocomplete="off"
        />
        <div class="vertical-spacer"></div>
      </div>
      <ul id="filtered-items-text" class="filtered-items"></ul>
    </div>
    <div id="icons" class="hidden" style="display: none">
      <div id="icon-close" style="display: none; width: 0px; height: 0px">
        <svg
          style="display: none; max-width: 2rem; max-height: 2rem"
          class="position-absolute top-50 start-50 translate-middle"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </div>
      <div id="icon-caret-down">
        <svg
          id="svg-caret-down"
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.1018 8C5.02785 8 4.45387 9.2649 5.16108 10.0731L10.6829 16.3838C11.3801 17.1806 12.6197 17.1806 13.3169 16.3838L18.8388 10.0731C19.5459 9.2649 18.972 8 17.898 8H6.1018Z"
            fill="#212121"
          />
        </svg>
      </div>
    </div>
  </div>
`;customElements.define("search-select",class extends HTMLElement{constructor(){super(),this.selectableItems=[],this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=_n,this.searchGroupElement=this.shadowRoot.getElementById("search-group"),this.searchInputGroupElement=this.shadowRoot.querySelector(".search-input-group"),this.searchInputElement=this.shadowRoot.getElementById("search-input"),this.filteredItemsElement=this.shadowRoot.getElementById("filtered-items-text"),this.selectedItemsElement=this.shadowRoot.getElementById("selected-items-text"),this.options=this.querySelectorAll("option")}initializeFilteredItems=()=>{this.options=this.querySelectorAll("option"),this.filteredItemDivs=[...this.options].map((t,e)=>{t.dataset.id=e,this.attributeChangeMutationObserver.observe(t,{attributes:!0});let s=document.createElement("li");return s.classList.add("filtered","item"),s.classList.toggle("even",e%2),s.innerHTML=t.innerHTML,s.dataset.optionId=t.dataset.id,s}),this.filteredItemsElement.replaceChildren(...this.filteredItemDivs),this.updateFilteredItems(),this.updateSelectedItems(!0)};updateFilteredItems=()=>{let t=this.searchInputElement.value;this.filteredItemDivs.forEach(s=>{let n=s.innerText.toLowerCase().search(t.toLowerCase())>=0,o=!t||n;s.classList.toggle("hidden",!o)}),[...this.options].filter(s=>s.hasAttribute("selected")).map(s=>{this.filteredItemDivs.find(n=>n.dataset.optionId===s.dataset.id).classList.add("hidden")});var e=[...this.filteredItemsElement.querySelectorAll("li:not(.hidden)")].map((s,n)=>s.classList.toggle("even",n%2))};updateActiveFilteredItem=t=>{if(!this.filteredItemDivs.find(r=>!r.classList.contains("hidden")))return;let s=this.filteredItemDivs.findIndex(r=>r.classList.contains("active")),n=s+t,o;do n>=this.filteredItemDivs.length&&(n=0),o=this.filteredItemDivs.at(n),n+=t;while(o.classList.contains("hidden"));o.classList.add("active"),s>=0&&this.filteredItemDivs[s].classList.remove("active")};selectActiveFilteredItem=()=>{let t=this.filteredItemDivs.find(e=>e.classList.contains("active"));t&&(this.selectFilteredItem(t),this.updateActiveFilteredItem(1))};updateSelectedItems=(t=!1)=>{this.selectedOptions=[...this.options].filter(n=>n.hasAttribute("selected"));let e=this.shadowRoot.getElementById("icon-close").innerHTML,s=this.selectedOptions.map(n=>{let o=document.createElement("div");o.classList.add("selected","item"),o.dataset.optionId=n.dataset.id;let r=document.createElement("div");r.innerText=n.innerHTML;let a=document.createElement("div");return a.classList.add("remove"),a.innerHTML=e,o.appendChild(r),o.appendChild(a),o});this.selectedItemsElement.replaceChildren(...s);for(let n of this.selectedItemsElement.getElementsByTagName("svg"))n.style.display="revert";t||this.dispatchEvent(new Event("change"))};selectFilteredItem=t=>{t&&[...this.options].find(e=>e.dataset.id===t.dataset.optionId).setAttribute("selected","")};removeSelectedItem=t=>{t&&([...this.options].find(e=>e.dataset.id===t.dataset.optionId).removeAttribute("selected"),this.updateSelectedItems(),this.updateFilteredItems())};connectedCallback(){let t=(s,n)=>{for(let o of s)o.type==="childList"&&this.initializeFilteredItems()},e=(s,n)=>{for(let o of s)o.type==="attributes"&&(this.updateSelectedItems(),this.updateFilteredItems())};this.attributeChangeMutationObserver=new MutationObserver(e),this.mutationObserver=new MutationObserver(t),this.mutationObserver.observe(this,{attributes:!0,childList:!0}),this.filteredItemsElement.classList.toggle("active",!1),this.initializeFilteredItems(),this.searchGroupElement.addEventListener("focusin",s=>{this.filteredItemsElement.classList.toggle("active",!0),this.searchGroupElement.classList.toggle("active",!0),clearTimeout(this.focusOutTimeout)}),this.searchGroupElement.addEventListener("focusout",s=>{this.focusOutTimeout=setTimeout(()=>{this.filteredItemsElement.classList.remove("active"),this.searchGroupElement.classList.remove("active")},0)}),this.searchInputElement.addEventListener("input",s=>{s.preventDefault(),this.searchText=this.searchInputElement.value,this.updateFilteredItems()}),this.searchInputElement.addEventListener("focusout",s=>{}),this.searchGroupElement.addEventListener("keydown",s=>{switch(s.code){case"Tab":this.filteredItemsElement.classList.remove("active");break;case"ArrowDown":this.updateActiveFilteredItem(1);break;case"ArrowUp":this.updateActiveFilteredItem(-1);break;case"Enter":this.handlingClick=!0,this.selectActiveFilteredItem();break;default:}}),this.filteredItemsElement.addEventListener("click",s=>{this.selectFilteredItem(s.target)}),this.selectedItemsElement.addEventListener("click",s=>{this.removeSelectedItem(s.target.closest("div.item"))})}disconnectedCallback(){try{this.mutationObserver.disconnect(),this.attributeChangeMutationObserver.disconnect()}catch{console.warn("cannot remove event listeners")}}});customElements.define("data-table",class extends HTMLTableElement{constructor(){let e=super();this.table=e,this.head=this.table.querySelector("thead"),this.body=this.table.querySelector("tbody")}onFilterEventHandler=e=>{[...this.table.querySelectorAll("tbody tr.hidden")].map(s=>s.classList.remove("hidden")),[...this.table.querySelectorAll("tbody td.filtered")].map(s=>s.closest("tr").classList.add("hidden")),this.filteredCntElement.innerText=this.table.querySelectorAll("tbody tr:not(.hidden)").length};onSearchEventHandler=e=>{[...this.table.querySelectorAll("tbody tr:not(.hidden)")].map(s=>s.classList.add("hidden")),[...this.table.querySelectorAll("tbody td.included")].map(s=>s.closest("tr").classList.remove("hidden"))};onSortEventHandler=e=>{let s=this.table.querySelectorAll("thead th.sorter-true"),n=0,o=0;for(let l of s){let u=l.cellIndex,d=l.classList,m=l.querySelector("i");m.classList.remove("fa-sort-down","fa-sort-up","fa-sort"),d.contains("desc")?(m.classList.add("fa-sort-down"),n=1,o=u):d.contains("asc")?(m.classList.add("fa-sort-up"),n=-1,o=u):m.classList.add("fa-sort")}if(!n)return;var r=new Intl.Collator([],{numeric:!0});let a=[...this.table.querySelectorAll("tbody tr")];a.sort((l,u)=>{let d=l.cells[o].textContent,m=u.cells[o].textContent;return r.compare(d,m)*n}),this.table.querySelector("tbody").append(...a)};createSortListeners=()=>{let e=this.table.querySelectorAll("thead th.sorter-true");for(let s of e){if(s.querySelector("i[class*=fa-sort"))return;let n=document.createElement("i");n.classList.add("fa-solid","fa-sort"),s.append(n),s.addEventListener("click",o=>{let r=this.table.querySelectorAll("thead th.sorter-true"),a=s.cellIndex;for(let g of r)g.classList.contains("sorter-true")&&g!=s&&(g.classList.remove("asc","desc"),g.querySelector("i").classList.remove("fa-sort-up","fa-sort-down"),g.querySelector("i").classList.add("fa-sort"));s.querySelector("i").classList.remove("fa-sort");let l=0,u=s.classList;u.contains("desc")?u.replace("desc","asc"):u.contains("asc")?u.replace("asc","desc"):u.add("desc");let d=new Event("sort");this.table.dispatchEvent(d);return;var m})}};createFilters=()=>{let e={checkbox:ua,daterange:aa,multiselect:da,search:la},s=[];return this.table.querySelectorAll("[data-filter]").forEach(n=>{let o=n.cellIndex,r=e[n.dataset.filter];if(r){let a=new r(this.table,o,n.dataset.filterText);n.replaceChildren(a.element),s.push(a),n.dataset.filterValue&&a.setFilter(n.dataset.filterValue)}}),s};filterByColIndex=(e,s)=>{let n=this.table.querySelector(`tr.rowFilters th:nth-of-type(${e+1})`);n.dataset.filterValue=s,this.update()};createExportOptions=()=>{let e=document.createElement("div");e.classList.add("export-options","quick-links","secondary");let s=document.createElement("button");s.setAttribute("type","button"),s.setAttribute("title","Click here to Print"),s.classList.add("btn","btn-link"),s.innerHTML='<i class="fa-solid fa-print"></i>',s.addEventListener("click",()=>{pa(this.table.parentElement)});let n=document.createElement("button");n.setAttribute("type","button"),n.setAttribute("title","Export to CSV"),n.classList.add("btn","btn-link"),n.innerHTML='<i class="fa-solid fa-file-csv"></i>',n.addEventListener("click",()=>{let o=this.table.dataset.filePrefix+new Date().format("yyyyMMdd_hhmmtt");fa(o,this.table)}),e.append(s,n),this.table.before(e)};createRowCount=()=>{let e=document.createElement("tr"),s=document.createElement("th");s.setAttribute("colspan",this.table.querySelector("tr").children.length),this.filteredCntElement=document.createElement("span"),this.filteredCntElement.classList.add("table-count","filtered-count"),this.totalCntElement=document.createElement("span"),this.totalCntElement.classList.add("table-count","total-count"),s.append("Displaying ",this.filteredCntElement," out of ",this.totalCntElement," items"),e.append(s);let n=this.table.querySelector("tfoot");n||(n=document.createElement("tfoot"),this.table.append(n)),n.append(e)};updateCounts=()=>{let e=this.table.querySelectorAll("tbody tr").length;this.totalCntElement.innerText=e,this.rowCount=e,this.colCount=this.table.querySelectorAll("thead > tr th").length};update=()=>{this.isUpdating=!0,this.filters=this.createFilters(),this.createSortListeners(),this.onSortEventHandler(),this.onFilterEventHandler(),this.updateCounts()};init=()=>{this.createExportOptions(),this.createRowCount(),this.update()};connectedCallback(){let e=this.table.addEventListener("search",o=>this.onSearchEventHandler(o)),s=this.table.addEventListener("filter",o=>this.onFilterEventHandler(o)),n=this.table.addEventListener("sort",o=>{this.isUpdating=!0,this.onSortEventHandler(o)});this.init()}disconnectedCallback(){try{this.headerMutationObserver.disconnect()}catch{console.warn("failed to disconnect data-table")}}},{extends:"table"});var ra=864e13;function aa(t,e,s){let n=A=>{h(o.value,a.value);let w=new Event("filter");t.dispatchEvent(w)},o=document.createElement("input");o.setAttribute("type","date"),o.classList.add("form-control","small");let r=document.createElement("label");r.append("From: ",o),r.setAttribute("title","Filter Start Date"),o.addEventListener("change",n);let a=document.createElement("input");a.setAttribute("type","date"),a.classList.add("form-control","small");let l=document.createElement("label");l.append("To: ",a),l.setAttribute("title","Filter End Date"),a.addEventListener("change",n);let u=document.createElement("button");u.setAttribute("title","Clear Filter"),u.setAttribute("type","button"),u.classList.add("btn","btn-link"),u.append("clear filters"),u.addEventListener("click",d);function d(){o.value=o.defaultValue,a.value=a.defaultValue,n()}let m=document.createElement("div");m.append(r,l,u),m.classList.add("filter-inputs");let p=document.createElement("div"),g=document.createElement("select");g.innerHTML=`
  <option value="">Select...</option>
  <option value="week">Last 7 Days</option>
  <option value="month">This Month</option>
  <option value="quarter">This Quarter</option>
  <option value="custom">Custom</option>
  `,g.classList.add("form-select","small"),g.addEventListener("change",A=>{let w=new Date;w.setHours(0,0,0,0);let D=new Date;switch(D.setHours(0,0,0,0),A.target.value){case"":d(),m.classList.remove("active");return;case"week":w=new Date(w.getTime()-7*24*60*60*1e3);break;case"month":w.setDate(1),D.setMonth(D.getMonth()+1),D.setDate(0);break;case"quarter":w.setDate(1);let k=w.getMonth();k<=2?(w.setMonth(0),D.setMonth(3)):k<=5?(w.setMonth(3),D.setMonth(6)):k<=8?(w.setMonth(6),D.setMonth(9)):k<=11&&(w.setMonth(9),D.setMonth(12)),D.setDate(0);break;default:m.classList.add("active");return}m.classList.add("active"),o.value=w.toISOString().split("T")[0],a.value=D.toISOString().split("T")[0],n()}),p.append(g,m),p.classList.add("filter-date-range");let b=[...t.querySelectorAll(`tbody tr td:nth-of-type(${e+1})`)],h=(A,w=null)=>{A=A?new Date(A):new Date(0),w=w?new Date(w):new Date(ra),b.map(D=>{let k=D.innerText.trim();if(!k)return;let G=new Date(k);D.classList.toggle("filtered",!(A<=G&&G<=w))})};return{element:p,search:A=>Gs(b,A),filter:h}}function la(t,e,s){let n=t.querySelectorAll("tbody tr"),o=document.createElement("input");o.classList.add("border","border-lightGray","rounded","w-[90%]","form-control","small"),o.setAttribute("placeholder","Search...");let r=[];for(let u=0;u<n.length;u++){let d=n[u].getElementsByTagName("td")[e];r.push(d)}o.addEventListener("keyup",u=>{let d=u.target.value;l(d);let m=new Event("filter");t.dispatchEvent(m)});let a=u=>Gs(r,u),l=u=>Tn(r,u);return{element:o,search:a,filter:l}}function ua(t,e,s){let n=t.querySelectorAll("tbody tr"),o=document.createElement("input");o.classList.add("form-check-input","small"),o.setAttribute("type","checkbox"),o.setAttribute("autocomplete","off"),o.checked="true";let r=[];for(let u=0;u<n.length;u++){let d=n[u].getElementsByTagName("td")[e];r.push(d)}o.addEventListener("change",u=>{let d=u.target.checked?"true":"false";a(u.target.checked);let m=new Event("filter");t.dispatchEvent(m)});let a=u=>ca(r,u);return{element:o,search:u=>Gs(r,u),filter:a}}function da(t,e,s){let n=t.querySelectorAll("tbody tr"),o=document.createElement("search-select");o.setAttribute("multiple",!0),o.classList.add("multiple");let r=[...t.querySelectorAll(`tbody tr td:nth-of-type(${e+1})`)],a=new Set;function l(){r.map(h=>{h.innerText&&a.add(h.innerText.trim())});let b=[...a].sort().map(h=>{let S=document.createElement("option");return S.value=h,S.innerText=h,S});o.replaceChildren(...b)}function u(){console.log("Rows added to table");for(let b=0;b<n.length;b++)n[b].classList.contains("hidden")?a.delete(r[b].innerHTML):a.add(r[b].innerHTML);[...a].sort().forEach(b=>{let h=document.createElement("option");h.value=b,h.innerHTML=b,o.appendChild(h)})}function d(b){[...o.options].find(h=>h.value==b)?.setAttribute("selected","")}o.addEventListener("change",b=>{let h=[...o.selectedOptions].map(w=>w.value),S=h[0]=="";g(h);let A=new Event("filter");t.dispatchEvent(A)});let m=b=>Gs(r,b),p=b=>Tn(r,b),g=b=>ma(r,b);return l(),{setFilter:d,element:o,search:m,filter:p}}function Gs(t,e){return e=e.toLowerCase(),t.filter(s=>s.innerText.toString().trim().toLowerCase().includes(e))}function Tn(t,e){e=e.toLowerCase(),t.map(s=>{let n=s.innerText.toString().trim().toLowerCase();s.classList.toggle("filtered",!n.includes(e))})}function ca(t,e){t.map(s=>{s.classList.toggle("filtered",s.querySelector("input").checked!=e)})}function ma(t,e){let s=e.flatMap(n=>n)=="";t.map(n=>{let o=n.innerText?.trim();n.classList.toggle("filtered",!s&&!e.includes(o))})}function pa(t){let e=t.dataset.title;var s=new Date,n=Audit.Common.Utilities.GetSiteUrl(),o=n+"/siteassets/css/tablesorter/style.css?v="+s.format("MM_dd_yyyy"),r=n+"/siteAssets/css/audit_styles.css?v="+s.format("MM_dd_yyyy"),a=$(t).html(),l=$("<div>").append(a);l.find(".sr1-request-requestNum a").each(function(){$(this).removeAttr("onclick"),$(this).removeAttr("href")}),l.find(".sr2-response-requestNum a").each(function(){$(this).removeAttr("onclick"),$(this).removeAttr("href")}),a=l.html();var u=s.format("MM/dd/yyyy hh:mm tt");u="<div style='padding-bottom:10px;'>"+u+" - "+e+"</div>",a=u+a;var d=$("<div></div>"),m=$("<div></div>"),p=$.Deferred(),g=$.Deferred(),b="";d.load(o,function(){b+="<style>"+d.html()+"</style>",p.resolve()}),m.load(r,function(){b+="<style>"+m.html()+"</style>",g.resolve()}),$.when(p,g).done(function(){var h=`<HTML>
<HEAD>

<Title>`+e+`</Title>
`+b+`
<style>.hideOnPrint, .rowFilters, .actionOfficeContainer {display:none}</style>
</HEAD>
<BODY>
`+a+`
</BODY>
</HTML>`,S=window.open("","Print Web Part");if(!S){alert("No printWebPart!");return}S.document.open(),S.document.write(h),S.document.close(),S.print()})}function fa(t,e,s){var n=ga(e);if(!n){alert("No data!");return}s==!0&&(n=n.slice(1));var o=ha(n);if(navigator.userAgent.search("Trident")>=0)window.CsvExpFrame.document.open("text/html","replace"),window.CsvExpFrame.document.write(o),window.CsvExpFrame.document.close(),window.CsvExpFrame.focus(),window.CsvExpFrame.document.execCommand("SaveAs",!0,t+".csv");else{var r="data:text/csv;charset=utf-8,"+escape(o),a=document.createElement("a");a.href=r,a.download=t+".csv",document.body.appendChild(a),a.click(),document.body.removeChild(a)}}function ga(t){if(t){if(t.innerHTML.indexOf("rowFilters")>=0){var e=$("<div>").append(t.outerHTML);e.find(".rowFilters").each(function(){$(this).remove()}),t=e.find("table")[0]}if(t.innerHTML.indexOf("footer")>=0){var e=$("<div>").append(t.outerHTML);e.find(".footer").each(function(){$(this).remove()}),t=e.find("table")[0]}if(t.innerHTML.indexOf("actionOfficeContainer")>=0){var e=$("<div>").append(t.outerHTML);e.find(".actionOfficeContainer").each(function(){$(this).remove()}),e.find(".sr1-request-actionOffice-item").each(function(){var d=$(this).text()+", ";$(this).text(d)}),t=e.find("table")[0]}for(var s=[],n=0,o=t.rows.length;n<o;n++){s[n]=[];for(var r=0,a=t.rows[n].cells.length;r<a;r++){var l=t.rows[n].cells[r].textContent||t.rows[n].cells[r].innerText;s[n][r]=l.trim()}}return s}}function ha(t){for(var e=typeof t!="object"?JSON.parse(t):t,s=`sep=,\r
`,n="",o,r,a=0;a<e.length;a++){n="";var l=e[a];for(o in l)l.hasOwnProperty(o)&&(r=l[o]+"",n+='"'+r.replace(/"/g,'""')+'",');n=n.slice(0,-1),s+=n+`\r
`}return s}te();Be();var Io={};window.history.replaceState({},"",document.location.href);function oi(t,e){if(ri(t)==e)return;let s=window.location.search,n=new RegExp("([?;&])"+t+"[^&;]*[;&]?"),o=s.replace(n,"$1").replace(/&$/,""),r=(o.length>2?o+"&":"?")+(e?t+"="+e:"");Io[t]=e,window.history.pushState(Io,"",r.toString())}function ri(t){let e=new RegExp("[?&]"+t+"=([^&#]*)").exec(window.location.href);return e==null?null:decodeURI(e[1])||0}var rs=class{constructor(e,s="Tab"){this.urlParam=s,ko.utils.arrayPushAll(this.tabOpts,e),this.selectedTab.subscribe(this.tabChangeHandler),window.addEventListener("popstate",this.popStateHandler)}tabOpts=ko.observableArray();selectedTab=ko.observable();isSelected=e=>e.id==this.selectedTab()?.id;clickTabLink=e=>{this.selectedTab(e),console.log("selected: "+e.id)};selectTab=e=>this.selectById(e.id);selectById=e=>{let s=this.tabOpts().find(n=>n.id==e)??this.getDefaultTab();this.selectedTab(s)};getDefaultTab=()=>this.tabOpts()[0];tabChangeHandler=e=>{e&&oi(this.urlParam,e.id)};popStateHandler=e=>{e.state&&e.state[this.urlParam]&&this.selectById(e.state[this.urlParam])}},bt=class{constructor(e,s,n){this.id=e,this.linkText=s,this.template=n}};Li();Ks();te();te();var Po=ce`
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
`;var La="modal-dialog-component",ai=ko.observableArray(),li;function Le(t){ai.push(t)}var $i=class{constructor(e){if(this.dialogOpts=e,this.title=e.title,this.dialogReturnValueCallback=e.dialogReturnValueCallback,this.form=e.form,this.form?.onComplete){alert("Pass the form onComplete to the modal dialog!");return}this.form.onComplete=this.close.bind(this),li=this.toggle}toggle=(e=null)=>{e==null&&(e=!this.dlgElement.hasAttribute("open")),e?this.showModal():this.hide()};showModal=()=>{this.dlgElement.showModal(),this.dlgElement.classList.add("active")};clickClose=()=>{this.close(!1)};hide=()=>{this.dlgElement.close(),this.dlgElement.classList.remove("active")};close(e){this.dlgElement.close(),this.dlgElement.classList.remove("active"),this.dialogReturnValueCallback&&this.dialogReturnValueCallback(e),ai.remove(this.dialogOpts)}_id;getUniqueId=()=>(this._id||(this._id="field-"+Math.floor(Math.random()*1e4)),this._id);koDescendantsComplete=function(e){this.dlgElement=e.querySelector("dialog"),Qa(this.dlgElement),Ma(this.dlgElement),this.showModal()}};he(La,{template:Po,viewModel:$i});function Ma(t){t.style.width="550px",t.style.height="",t.style.top="125px",t.style.left=(window.GetViewportWidth()-550)/2+"px"}function Qa(t){var e=0,s=0,n=0,o=0;let r=t.querySelector(".grabber");r?r.onmousedown=a:t.onmousedown=a;function a(d){d=d||window.event,d.preventDefault(),n=d.clientX,o=d.clientY,document.onmouseup=u,document.onmousemove=l}function l(d){d=d||window.event,d.preventDefault(),e=n-d.clientX,s=o-d.clientY,n=d.clientX,o=d.clientY,t.style.top=t.offsetTop-s+"px",t.style.left=t.offsetLeft-e+"px"}function u(){document.onmouseup=null,document.onmousemove=null}}var qo=String.raw,ze=class{constructor({entity:e=null,view:s=null}){this.entity=e,this.view=s??e.constructor.Views.All}saving=ko.observable(!1);FormFields=ko.pureComputed(()=>{let e=ko.utils.unwrapObservable(this.entity);return Object.entries(e.FieldMap).filter(([s,n])=>this.view.includes(s)&&n?.Visible()).map(([s,n])=>n)});validate=(e=!0)=>(Object.values(this.FormFields()).map(s=>s?.validate&&s.validate(e)),this.ShowErrors(e),this.Errors());ShowErrors=ko.observable(!1);Errors=ko.pureComputed(()=>Object.values(this.FormFields()).filter(e=>e?.Errors&&e.Errors()).flatMap(e=>e.Errors()));IsValid=ko.pureComputed(()=>!this.Errors().length);params=this};var Eo="default-constrained-entity-form",ui=class extends ze{constructor({entity:e,view:s,displayMode:n}){super({entity:e,view:s}),this.displayMode(n)}displayMode=ko.observable();clickSubmit(){}clickCancel(){}clickClear(){}params=this;componentName=Eo},$a=qo`
  <div class="audit-form bg-dark">
    <div class="form-fields vertical" data-bind="foreach: FormFields">
      <div
        class="form-field-component"
        data-bind="component: {
            name: components[$parent.displayMode()], params: $data}, 
            class: classList"
      ></div>
    </div>
  </div>
`;ko.components.register(Eo,{template:$a});var Fo={new:"new",edit:"edit",view:"view"};function ks(t,e=null){return new ui({entity:t,view:e,displayMode:Fo.view})}Ge();Ge();Be();async function No(t,e){let s=await _s(t),n=s.RequestingOffice.Value();if(!n)return;let o=await Hi(s),r=await di(s);if(!o.filter(p=>e.includes(p.ID)).map(p=>p.ResID.Value()).reduce((p,g)=>(p.find(b=>b?.ID==g.ID)||p.push(g),p),[]).length)return;let l=await Uo(s.Title,n.ID),u=await Oo(n),d=parseInt(u.ResponseCount);d||(d=0);let m="";return await Promise.all(e.map(async p=>{let g=o.find(k=>k.ID==p);if(g.DocumentStatus.Value()==Xe.SentToQA)return;d++;let b=r.find(k=>k.ID==g.ResID.Value().ID),h=Go(s,b,g),S=g.FileRef.Value(),A=l+"/"+h;await T.utilities.copyFileAsync(S,A);let D=(await T.AuditResponseDocsRO.FindByColumnValue([{column:"FileRef",value:A}],{},{count:1})).results[0]??null;D&&(D.markApprovedForRO(s,b),await T.AuditResponseDocsRO.UpdateEntity(D,ns.Views.ApprovedForROUpdate),g.markApprovedForRO(h),await T.AuditResponseDocs.UpdateEntity(g,["DocumentStatus","RejectReason","FileLeafRef"]),m+=`<li><a href="${window.location.origin+D.FileRef}" target="_blank">${h}</a></li>`)})),u.ResponseCount=d,u.Responses+=m,await T.AuditROEmailsLog.UpdateEntity(u,["Responses","ResponseCount"]),!0}Be();Ge();Lt();Be();_t();te();Mt();var xt={pending:"Pending",aging:"Aging",completed:"Completed"},ci=class{constructor({msg:e,blocking:s}){this.msg=e,this.blocking=s,this.Status(xt.pending)}msg;blocking;Status=ko.observable();timeout=window.setTimeout(()=>{console.warn("this task is aging:",this),this.Status(xt.aging)},5e3);markComplete=()=>{window.clearTimeout(this.timeout),this.Status(xt.completed)};IsBlocking=ko.pureComputed(()=>this.blocking&&this.Status()!=xt.completed)},Ts=class t{constructor({msg:e,blocking:s}){this.msg=e,this.blocking=s,this.Status(xt.pending)}msg;blocking;Status=ko.observable();updateProgress=({percentDone:e})=>{this.Status(`${parseInt(e*100)}%`)};setTimeout=()=>window.setTimeout(()=>{console.warn("this task is aging:",this),this.Status(`${this.Status()} (${xt.aging})`)},5e4);resetTimeout=()=>{window.clearTimeout(this.timeout),this.timeout=this.setTimeout()};timeout=this.setTimeout();markComplete=()=>{window.clearTimeout(this.timeout),this.Status(xt.completed)};IsBlocking=ko.pureComputed(()=>this.blocking&&this.Status()!=xt.completed);static Create(e){return new t(e)}};var Is=ko.observableArray(),Bo=ko.pureComputed(()=>Is().filter(t=>t.IsBlocking())??[]),as=class{constructor(e,s=!1,n=null){this.msg=e,this.blocking=s,this.type=n}msg;blocking;type},me={init:{msg:"Initializing the Application",blocking:!0},save:{msg:"Saving Request",blocking:!0},newRequest:{msg:"Processing New Request",blocking:!0},cancelAction:{msg:"Cancelling Action",blocking:!0},view:{msg:"Viewing Request",blocking:!1},refresh:{msg:"Refreshing Request",blocking:!1},permissionsRequest:{msg:"Updating Request Item Permissions",blocking:!0},permissionsResponse:t=>({msg:"Updating Response Item Permissions: "+t,blocking:!0}),permissionsResponseFolder:t=>({msg:"Updating Response Folder Item Permissions: "+t,blocking:!0}),permissionsResponseAndFolder:t=>({msg:"Updating Response and Folder Item Permissions: "+t,blocking:!0}),permissionsEmailFolder:{msg:"Updating Email Folder Permissions",blocking:!0},permissionsCoversheet:t=>({msg:"Updating Coversheet Permissions: "+t,blocking:!0}),ensurePagePermissions:t=>new as("Ensuring Page Permissions: "+t),resetPagePermissions:t=>new as("Resetting Page Permissions: "+t,!0),ensureListPermissions:t=>new as("Ensuring List Permissions: "+t.ListDef.title),resetListPermissions:t=>new as("Resetting List Permissions: "+t.ListDef.title,!0),deleteEmailFolder:{msg:"Deleting Email Folder",blocking:!0},newResponse:t=>({msg:"Submitting new Response: "+t,blocking:!0}),updateResponse:t=>({msg:"Updating Response: "+t,blocking:!0}),deleteResponse:t=>({msg:"Deleting Response: "+t,blocking:!0}),closeResponse:t=>({msg:"Closing Response: "+t,blocking:!0}),uploadResponseDoc:t=>({msg:"Uploading Response Document: "+t,blocking:!0,type:Ts}),updateResponseDoc:t=>({msg:"Updating Response Document: "+t,blocking:!0}),approveResponseDoc:t=>({msg:"Approving Response Document: "+t,blocking:!0}),deleteResponseDocFolder:t=>({msg:"Deleting Response Document Folder: "+t,blocking:!0}),uploadCoversheet:t=>({msg:"Uploading Coversheet: "+t,blocking:!0,type:Ts}),updateCoversheet:t=>({msg:"Updating Coversheet: "+t,blocking:!0}),deleteCoversheet:t=>({msg:"Deleting Coversheet: "+t,blocking:!0}),deleteRequestInternalItem:{msg:"Deleting Request Internal Item",blocking:!0},newComment:{msg:"Submitting Comment",blocking:!1},refreshComments:{msg:"Refreshing Comments",blocking:!1},notifyComment:{msg:"Sending Comment Email",blocking:!1},removeComment:{msg:"Removing Comment",blocking:!1},newAction:{msg:"Submitting Action",blocking:!1},refreshActions:{msg:"Refreshing Actions",blocking:!1},newAttachment:{msg:"Submitting Attachment",blocking:!1},refreshAttachments:{msg:"Refreshing Attachments",blocking:!1},approve:{msg:"Approving Request",blocking:!0},lock:{msg:"Locking Request",blocking:!0},closing:{msg:"Closing Request",blocking:!0}},pe=t=>{let e;return t.type?e=t.type.Create(t):e=new ci(t),Is.push(e),e},de=function(t){t&&(t.markComplete(),window.setTimeout(()=>ja(t),3e3))},ja=function(t){Is.remove(t)};var se={FullControl:"Full Control",Design:"Design",Edit:"Edit",Contribute:"Contribute",Read:"Read",LimitedAccess:"Limited Access",RestrictedRead:"Restricted Read",RestrictedContribute:"Restricted Contribute",InitialCreate:"Initial Create"};function Mo(){Wa(),Ka()}function Wa(){Wi(),["AuditBulkAddResponse.aspx","AuditBulkEditResponse.aspx","AuditPermissions.aspx","AuditReport_RequestsStatus.aspx","AuditReturnedResponses.aspx","AuditUnSubmittedResponseDocuments.aspx","AuditUpdateSiteGroups.aspx"].map(t=>Ps(t,[]))}function Wi(){let t=Ve().filter(o=>o.Role!=gt.REQUESTINGOFFICE);Ps("AO_DB.aspx",t);let e=Ve().filter(o=>o.Role==gt.REQUESTINGOFFICE);Ps("RO_DB.aspx",e);let s=Ve().filter(o=>o.Role==gt.QUALITYASSURANCE);Ps("QA_DB.aspx",s);let n=Ve().filter(o=>o.Role==gt.SPECIALPERMISSIONS);Ps("SP_DB.aspx",n)}async function Ps(t,e){let s=pe(me.ensurePagePermissions(t)),o=(await T.Pages.FindByColumnValue([{column:"FileLeafRef",value:t}],{},{count:1,includePermissions:!0})).results[0]??null;if(!o){console.warn("Unable to ensure page permissions. Page not found: "+t,e),de(s);return}let r=!1;if(o.HasUniqueRoleAssignments||(r=!0),!r){let a=o.RoleAssignments.results.map(l=>l.PrincipalId);r=!!e.find(l=>{let u=l.UserGroup?.ID;return!a.includes(u)})}if(r){let a=pe(me.resetPagePermissions(t)),{owners:l,members:u,visitors:d}=ht(),m=[new Ye({principal:l,roleDefs:[new Ze({name:se.FullControl})]}),new Ye({principal:u,roleDefs:[new Ze({name:se.RestrictedRead})]}),new Ye({principal:d,roleDefs:[new Ze({name:se.RestrictedRead})]})],p=e.map(b=>new Ye({principal:b.UserGroup,roleDefs:[{name:se.RestrictedRead}]})),g=new xe({hasUniqueRoleAssignments:!0,roles:[...p,...m]});console.warn("Resetting Page Perms: ",t),await T.Pages.SetItemPermissions(o,g,!0),de(a)}de(s)}function ji(t){return Ve().filter(e=>e.Role==t&&e.UserGroup).map(e=>new $e(e.UserGroup))}function Ka(){let{owners:t,members:e,visitors:s}=ht(),n=[new Ye({principal:t,roleDefs:[new Ze({name:se.FullControl})]}),new Ye({principal:e,roleDefs:[new Ze({name:se.Contribute})]}),new Ye({principal:s,roleDefs:[new Ze({name:se.RestrictedRead})]})],o=ji(gt.QUALITYASSURANCE).map(u=>new Ye({principal:u,roleDefs:[new Ze({name:se.RestrictedContribute})]})),r=ji(gt.QUALITYASSURANCE).map(u=>new Ye({principal:u,roleDefs:[new Ze({name:se.RestrictedRead})]})),a=ji(gt.REQUESTINGOFFICE).map(u=>new Ye({principal:u,roleDefs:[new Ze({name:se.RestrictedRead})]}));[{entitySet:T.AuditBulkRequests,permissions:new xe({hasUniqueRoleAssignments:!0,roles:n})},{entitySet:T.AuditBulkResponses,permissions:new xe({hasUniqueRoleAssignments:!0,roles:n})},{entitySet:T.AuditResponseDocsRO,permissions:new xe({hasUniqueRoleAssignments:!0,roles:[...n,...o]})},{entitySet:T.AuditRequests,permissions:new xe({hasUniqueRoleAssignments:!0,roles:n})},{entitySet:T.AuditRequestsInternals,permissions:new xe({hasUniqueRoleAssignments:!0,roles:[...n,...r]})},{entitySet:T.AuditROEmailsLog,permissions:new xe({hasUniqueRoleAssignments:!0,roles:[...n,...o]})}].map(async u=>{let d=pe(me.ensureListPermissions(u.entitySet));await Ya(u),de(d)})}async function Ya({entitySet:t,permissions:e}){let s=await t.GetRootPermissions();if(!s.hasUniqueRoleAssignments){await Lo(t,e,!0,"List Inherits Permissions");return}let n=e.roles.find(o=>{let r=s.roles.find(l=>l.principal.ID==o.principal.ID);if(!r)return!0;let a=r.roleDefs.map(l=>l.name);return o.roleDefs.find(l=>!a.includes(l.name))});n&&await Lo(t,e,!1,{"Missing Permissions":n})}async function Lo(t,e,s,n){let o=pe(me.resetListPermissions(t));console.warn("Resetting EntitySet Permissions: "+t.ListDef.title,{entitySet:t,permissions:e,reason:n}),await t.SetRootPermissions(e,s),de(o)}Mt();te();Qi();async function Qo(){if((await T.AuditEmails.FindByColumnValue([{column:"Title",value:"RONotifications"}],{},{count:1,includeFolders:!0},["ID","Title"])).results[0]??null)return;let s=await T.AuditEmails.UpsertFolderPath("RONotifications"),{owners:n,members:o,visitors:r}=ht(),a=await is(),l=new xe({hasUniqueRoleAssignments:!0,roles:[]});l.addPrincipalRole(n,se.FullControl),l.addPrincipalRole(o,se.Contribute),l.addPrincipalRole(r,se.RestrictedRead),l.addPrincipalRole(a,se.RestrictedContribute),await T.AuditEmails.SetItemPermissions({ID:s},l,!0)}async function Oo(t){if(!t?.ID)return;let e=new Date().format("MM/dd/yyyy"),n=(await T.AuditROEmailsLog.FindByColumnValue([{column:"Title",value:e},{column:"RequestingOfficeId",value:t.ID}],{},{count:1,includeFolders:!0}))?.results[0]??null;if(n)return n;let o=new os;return o.Title=e,o.RequestingOffice=t,await T.AuditROEmailsLog.AddEntity(o),o}Be();Mt();te();Ge();Lt();Be();Mt();te();Lt();Ge();async function Ki(t,e,s=[]){let n=t.name,o=e.ReqNum.Value();n.includes(o)||(n=o+"_"+n);let r=Xa(n,null,e.Sensitivity.Value()),a=pe(me.uploadCoversheet(r)),u={Title:r.substring(0,r.lastIndexOf(".")),ReqNumId:e.ID,ActionOfficeId:s.map(m=>m.ID)},d=await T.AuditCoversheets.UploadFileToFolderAndUpdateMetadata(t,r,"",u,({currentBlock:m,totalBlocks:p})=>a.updateProgress({percentDone:m/p}));return await za(d),de(a),d}async function $o(t){let e=await T.AuditCoversheets.FindById(t);return Yi(e)}async function Yi(t){let e=pe(me.deleteCoversheet(t.FileName.toString()));await T.AuditCoversheets.RemoveEntityById(t.ID),de(e)}async function Ho(t){let e=t.ReqNum.Value();if(!e)throw new Error("ReqNum not set!");let s=pe(me.updateCoversheet(t.FileName.Value())),n=t.FileName.Value();n.includes(e.ReqNum.Value())||(n=e.ReqNum.Value()+"_"+n,t.FileName.Value(n)),await T.AuditCoversheets.UpdateEntity(t,Zt.Views.AOCanUpdate),de(s)}function Xa(t,e,s){let n="";var o=t,r=o.substring(0,o.lastIndexOf(".")),a=o.replace(r,"");return n=r,e!=null&&e!=""&&r.endsWith("_"+e)&&(n=n.replace("_"+e,"")),s!=null&&s!=""&&s!="None"&&(r.endsWith("_"+s)||(n=n+"_"+s)),n+a}async function za(t,e){let s=pe(me.permissionsCoversheet(t.FileName.Value())),n=await T.AuditCoversheets.GetItemPermissions(t),o=await ht(),r=await is(),a=n.principalHasPermissionKind(r,SP.PermissionKind.viewListItems),{specialPermGroup1:l,specialPermGroup2:u}=await bo(),d=n.principalHasPermissionKind(l,SP.PermissionKind.viewListItems),m=n.principalHasPermissionKind(u,SP.PermissionKind.viewListItems);n.hasUniqueRoleAssignments||(d=!1,m=!1,a=!1);let p=new xe({hasUniqueRoleAssignments:!0,roles:[]});p.addPrincipalRole(o.owners,se.FullControl),p.addPrincipalRole(o.members,se.Contribute),p.addPrincipalRole(o.visitors,se.RestrictedRead),(a||e)&&p.addPrincipalRole(r,se.RestrictedRead),d&&p.addPrincipalRole(l,se.RestrictedRead),m&&p.addPrincipalRole(u,se.RestrictedRead),t.ActionOffice.Value().map(b=>p.addPrincipalRole(new $e(b.UserGroup),se.RestrictedRead)),await T.AuditCoversheets.SetItemPermissions(t,p,!0),de(s)}_t();async function _s(t){return await T.AuditRequests.FindById(t)}async function Wo(t){return(await T.AuditRequests.FindByColumnValue([{column:"Title",value:t}],{},{count:1})).results[0]??null}async function mi(t){let e=t.FieldMap;if((await T.AuditRequests.FindByColumnValue([{column:"Title",value:e.Title.Value()}],{},{count:1})).results.length)throw new Error("Request with this name already exists!");t.FieldMap.EmailActionOffice.Value(t.FieldMap.ActionOffice.Value()),await T.AuditRequests.AddEntity(t)}async function Ko(t){await T.AuditRequests.UpdateEntity(t,ke.Views.IACanUpdate)}async function Yo(t){let e=await T.AuditRequests.FindById(t);e||alert("Could not find request: ",t);let s=e.ReqNum.Value(),n=[];(await jo(e)).map(l=>{n.push(Yi(l))}),n.push(new Promise(async l=>{let u=pe(me.deleteEmailFolder);await T.AuditEmails.RemoveFolderByPath(s),de(u),l()})),(await di(e)).map(l=>{n.push(deleteResponseAndFolder(l))});let a=await zo(t);return a&&n.push(new Promise(async l=>{let u=pe(me.deleteRequestInternalItem);await T.AuditRequestsInternals.RemoveEntityById(a.ID),de(u),l()})),await Promise.all(n),await T.AuditRequests.RemoveEntityById(t),!0}async function Uo(t,e){let n=(await T.AuditResponseDocsRO.FindByColumnValue([{column:"FileLeafRef",value:t}],{},{count:1,includeFolders:!0})).results[0]??null;if(n)return n.FileRef;let o=Ve().find(g=>g.ID==e),r=await T.AuditResponseDocsRO.UpsertFolderPath(t),{owners:a,members:l,visitors:u}=ht(),d=await is(),m=new xe({hasUniqueRoleAssignments:!0,roles:[]});return m.addPrincipalRole(a,se.FullControl),m.addPrincipalRole(l,se.Contribute),m.addPrincipalRole(u,se.RestrictedRead),m.addPrincipalRole(d,se.RestrictedContribute),m.addPrincipalRole(o.UserGroup,se.RestrictedRead),await T.AuditResponseDocsRO.SetItemPermissions({ID:r},m,!0),(await T.AuditResponseDocsRO.FindById(r)).FileRef}async function Xo(t){await Promise.all([Za(t),Ja(t),el(t)])}async function Ja(t){let e=await T.AuditEmails.UpsertFolderPath(t.ReqNum.Value()),s=new xe({hasUniqueRoleAssignments:!0,roles:[]}),{owners:n,members:o,visitors:r}=await ht(),a=await It(Audit.Common.Utilities.GetGroupNameQA());s.addPrincipalRole(n,se.FullControl),s.addPrincipalRole(o,se.RestrictedContribute),s.addPrincipalRole(r,se.RestrictedRead),s.addPrincipalRole(a,se.RestrictedContribute),t.FieldMap.ActionOffice.Value().map(d=>{s.addPrincipalRole(d.UserGroup,se.RestrictedContribute)});let u=await T.AuditEmails.SetItemPermissions({ID:e},s,!0)}async function Za(t){(await T.AuditRequests.GetItemPermissions(t)).hasUniqueRoleAssignments||(window.DEBUG&&console.log("Request does not have unique permissions"),await Vo(t))}async function el(t){let e=zo(t);if(e)return e;let s=new ss;return s.ReqNum.Value(t),await T.AuditRequestsInternals.AddEntity(s),s}async function Vo(t,e){let s=await T.AuditRequests.GetItemPermissions(t),n=await ht(),o=await It(Audit.Common.Utilities.GetGroupNameQA()),r=s.principalHasPermissionKind(o,SP.PermissionKind.viewListItems),a=await It(Audit.Common.Utilities.GetGroupNameSpecialPerm1()),l=await It(Audit.Common.Utilities.GetGroupNameSpecialPerm2()),u=s.principalHasPermissionKind(a,SP.PermissionKind.viewListItems),d=s.principalHasPermissionKind(l,SP.PermissionKind.viewListItems),m=new xe({hasUniqueRoleAssignments:!0,roles:[]});m.addPrincipalRole(n.owners,se.FullControl),m.addPrincipalRole(n.members,se.Contribute),m.addPrincipalRole(n.visitors,se.RestrictedRead),(r||e==Re.ApprovedForQA)&&m.addPrincipalRole(o,se.RestrictedRead),u&&m.addPrincipalRole(a,se.RestrictedRead),d&&m.addPrincipalRole(l,se.RestrictedRead),t.FieldMap.ActionOffice.Value().map(g=>m.addPrincipalRole(new $e(g.UserGroup),se.RestrictedRead)),await T.AuditRequests.SetItemPermissions(t,m,!0)}async function zo(t){let e=await T.AuditRequestsInternals.FindByColumnValue([{column:"ReqNum",op:"eq",value:t.ID}],{},{});if(e.results.length)return e.results.length>1&&console.error(e.results.length+" internal items!",t),e.results[0]}async function jo(t){return(await T.AuditCoversheets.FindByColumnValue([{column:"ReqNum",value:t.ID}],{},{})).results}async function di(t){return(await T.AuditResponses.FindByColumnValue([{column:"ReqNum",value:t.ID}],{},{includePermissions:!0})).results}async function Hi(t){return(await T.AuditResponseDocs.FindByColumnValue([{column:"ReqNum",value:t.ID}],{},{includePermissions:!0})).results}Ge();Be();async function Jo(t,e){let s=nr(t,e),n=pe(me.newResponse(s));e.Title.Value(s),e.ResStatus.Value(Re.Open);try{if((await T.AuditResponses.FindByColumnValue([{column:"Title",value:s}],{},{count:1})).results.length)throw new Error(`Response with title ${s} already exists!`);await T.AuditResponses.AddEntity(e)}catch(o){console.error("Error adding Response: ",o),alert(o.message)}finally{de(n)}}async function Zo(t,e){let s=pe(me.updateResponse(e.Title.Value()));try{if(!(e.ActionOffice.Value()?.Title?.toLowerCase()).includes("fpra")&&(e.POC.toString()||e.POCCC.toString()))throw new Error("Only FPRA Responses can have designated POC and POC CC fields.");let o=t.Sensitivity.Value();if(e.ResStatus.Value()==Re.ApprovedForQA&&o=="None")throw new Error("Request Sensitivity not set; cannot submit to QA.");let a=nr(t,e);e.Title.Value()!=a&&e.Title.Value(a),await T.AuditResponses.UpdateEntity(e,Ke.Views.IACanUpdate)}catch(n){console.error("Error Updating Response: ",n),alert(n.message)}finally{de(s)}}async function er(t){let e=t.Title.Value(),s=pe(me.deleteResponseDocFolder(e));await T.AuditResponseDocs.RemoveFolderByPath(e),de(s);let n=pe(me.deleteResponse(e));await T.AuditResponses.RemoveEntityById(t.ID),de(n)}async function tr(t,e,s){let n=pe(me.updateResponseDoc(s.Title.Value()));await T.AuditResponseDocs.UpdateEntity(s,Ct.Views.AOCanUpdate),de(n)}async function sr(t){let e=await T.AuditResponses.FindById(t);if(e)return tl(e)}async function tl(t){let e=pe(me.closeResponse(t.Title.Value()));t.markClosed(),await T.AuditResponses.UpdateEntity(t,Ke.Views.IAUpdateClosed),de(e)}async function ir(t,e){let s=pe(me.uploadResponseDoc(e.name)),n={Title:e.name,ReqNumId:t.ReqNum.Value().ID,ResIDId:t.ID};await T.AuditResponseDocs.UploadFileToFolderAndUpdateMetadata(e,e.name,t.Title.Value(),n,({currentBlock:o,totalBlocks:r})=>s.updateProgress({percentDone:o/r})),de(s)}function nr(t,e){return`${t.ReqNum.Value()}-${e.ActionOffice.Value()?.Title}-${e.SampleNumber.Value()}`}function Go(t,e,s){let n=s.FileName.Value(),o=s.Created.Value().format("yyyyMMddTHHmmss"),r=e.Title.Value(),a=t.Sensitivity.Value(),l=r+"_"+o+"_"+Math.ceil(Math.random()*1e4);a&&a!="None"&&(l+="_"+a);var u=n.substring(0,n.lastIndexOf(".")),d=n.replace(u,"");return l+=d,!n.includes(r)||!n.includes(o)||a&&!n.includes(a)?l:n}Mt();_t();te();te();var or=ce`
  <div class="audit-form bg-dark new-request-form">
    <div class="form-fields" data-bind="foreach: FormFields">
      <div
        class="form-field-component"
        data-bind="component: 
        {name: components.edit, params: $data}, 
        class: classList"
      ></div>
    </div>
    <div class="form-actions">
      <button type="button" class="btn btn-warn" data-bind="click: clearForm">
        Clear Form
      </button>
      <button
        type="button"
        class="btn btn-success"
        data-bind="click: clickSubmit"
      >
        Create Request
      </button>
    </div>
  </div>
`;var rr="newRequestForm",pi=class{constructor(e){this.onComplete=e?.onComplete}onComplete;newRequest=ko.observable(new ke);params=ko.pureComputed(()=>({newRequest:this.newRequest,reset:this.reset,onComplete:this.onComplete}));componentName=rr},fi=class extends ze{constructor({newRequest:e,onComplete:s}){super({entity:e,view:ke.Views.New}),this.onComplete=s,this.prepopulateRequestFields()}saving=ko.observable(!1);prepopulateRequestFields(){let e=ko.unwrap(this.entity);if(!e)return;let s=ws["current-fy"];e.FiscalYear.Value(s);let n=ws["default-req-type"];e.ReqType.Value(n),e.Reminders.Value(e.Reminders.Options()),e.ReqStatus.Value(nt.OPEN)}async clickSubmit(){this.saving(!0),await this.submit(),this.saving(!1)}async submit(){if(this.validate().length)return;let s=this.entity();try{await mi(s),this.onComplete(SP.UI.DialogResult.OK)}catch(n){alert(n)}}clearForm(){this.entity(new ke),this.prepopulateRequestFields()}};he(rr,{template:or,viewModel:fi});Be();te();Ge();te();Ge();te();var ar=ce`
  <div id="approveResponseDocDlg" class="audit-form bg-dark">
    <div>
      Are you sure you would like to
      <span class="fw-bold success">Approve</span> the Response Document(s)?
      <ul>
        <!-- ko foreach: responseDocs -->
        <li class="fw-bold success" data-bind="text: fileName"></li>
        <!-- /ko -->
      </ul>
    </div>
    <div class="form-actions">
      <button
        type="button"
        class="btn btn-success"
        data-bind="click: clickSubmit, text: sendToText, 
      attr: {title: sendToText}"
      ></button>
    </div>
  </div>
`;var lr="confirm-approve-response-doc",ls=class{constructor(e,s,n){switch(this.request=e,this.response=s,this.responseDocs(n),e.reqType){case it.TASKER:this.sendToText("Send to "+e.requestingOffice);break;case it.REQUEST:this.sendToText("Send to QA");break;default:this.sendToText("Uh Oh")}}sendToText=ko.observable();responseDocs=ko.observableArray();saving=ko.observable(!1);async clickSubmit(){this.saving(!0),await this.submit(),this.saving(!1)}async submit(){let e=this.responseDocs().map(n=>n.ID),s;switch(this.request.reqType){case it.TASKER:s=await No(this.request.ID,e);break;case it.REQUEST:s=await ur(this.request,this.responseDocs());break;default:this.sendToText("Uh Oh")}s&&this.onComplete(!0)}componentName=lr;params=this};he(lr,{template:ar});te();te();var dr=ce`
  <div id="rejectResponseDocDlg" class="audit-form bg-dark">
    <div>
      Are you sure you would like to
      <span class="text-danger fw-bold">Reject</span> the Response Document(s)?
      <ul>
        <!-- ko foreach: responseDocs -->
        <li class="text-danger fw-bold" data-bind="text: fileName"></li>
        <!-- /ko -->
      </ul>
    </div>
    <div class="component field">
      <label class="fw-semibold"
        >If so, please specify the reason<span class="fw-bold text-danger"
          >*</span
        >:
        <textarea
          class="form-control w-full"
          rows="3"
          data-bind="textInput: rejectReason"
        ></textarea>
      </label>
    </div>
    <br />
    <div class="form-actions">
      <button
        type="button"
        class="btn btn-danger"
        value="Reject Documents"
        data-bind="click: clickSubmit, 
      enable: rejectReason"
      >
        Yes, Reject Document
      </button>
    </div>
  </div>
`;var cr="confirm-reject-response-doc",gi=class{constructor(e,s,n){this.request=e,this.response=s,this.responseDocs(n)}rejectReason=ko.observable();responseDocs=ko.observableArray();saving=ko.observable(!1);async clickSubmit(){this.saving(!0),await this.submit(),this.saving(!1)}async submit(){await Promise.all(this.responseDocs().map(e=>mr(this.request,e,this.rejectReason()))),this.onComplete(!0)}componentName=cr;params=this};he(cr,{template:dr});te();te();var pr=ce`
  <div id="deleteRequestDlg" class="audit-form bg-dark">
    <div>
      Are you sure you would like to
      <span class="text-danger fw-bold">Delete</span> the Request and associated
      files?
      <ul>
        <li class="text-danger fw-bold" data-bind="text: request.number"></li>
      </ul>
    </div>

    <div class="form-actions">
      <button
        type="button"
        class="btn btn-danger"
        value="Delete Request"
        data-bind="click: clickSubmit, enable: !saving()"
      >
        Yes, Delete Request
      </button>
    </div>
  </div>
`;var Xi="confirm-delete-request",hi=class{constructor(e){this.request=e}saving=ko.observable();async clickSubmit(){this.saving(!0),await this.submit(),this.saving(!1)}async submit(){await Yo(this.request.ID)&&this.onComplete(!0)}componentName=Xi;params=this};he(Xi,{template:pr});ro({name:Xi,folder:"forms/request/confirm_delete",template:"ConfirmDeleteRequestFormTemplate"});te();var fr=ce`
  <div class="request-detail-view" data-bind="visible: currentRequest">
    <div id="divRequestInfoContainer">
      <div
        id="divRequestClose"
        style="width: 300px"
        data-bind="visible: bDisplayClose"
      >
        <fieldset style="border-color: GreenYellow">
          <legend style="font-weight: bold; font-size: 12pt">Action</legend>
          <span class="fa-solid fa-lock"></span
          ><button
            type="button"
            class="btn btn-link"
            id="btnCloseRequest"
            title="Close this Request"
            data-bind="click: $root.ClickCloseRequest"
          >
            Close this Request
          </button>
        </fieldset>
      </div>

      <div data-bind="if: currentRequestResponsesReadyToClose().length">
        <fieldset class="emphasized-section">
          <legend>Responses Ready to Close</legend>
          <table class="tablesorter">
            <thead>
              <tr>
                <th>Response</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody data-bind="foreach: currentRequestResponsesReadyToClose">
              <tr>
                <td
                  class="response-title"
                  data-bind="attr: {'id': 'response-item-title-' + title}"
                >
                  <span
                    title="View Response Docs"
                    class="btn btn-link"
                    data-bind="text: title, click: $parent.viewResponseDocs"
                  ></span>
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-link"
                    title="Close Response"
                    data-bind="click: clickCloseResponse"
                  >
                    <span class="fa-solid fa-circle-check"></span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <button
            type="button"
            class="btn btn-link"
            title="Close all Responses"
            data-bind="click: clickCloseReadyResponses"
          >
            <span class="fa-solid fa-check-double"></span> Close All Responses
          </button>
        </fieldset>
      </div>

      <div
        id="divRequestInfo"
        class="audit-form request-info-form"
        data-bind="with: currentRequest"
      >
        <div class="form-header">
          <h3 class="uppercase form-title">
            AUDIT REQUEST DETAILS
            <span class="fw-semibold" data-bind="text: number"></span> |
            <span class="text-primary"
              >FY-<span data-bind="text: fiscalYear"></span
            ></span>
          </h3>
          <button
            type="button"
            class="btn btn-link form-title"
            data-bind="click: $parent.refreshRequest"
          >
            <i title="Refresh Request" class="fa-solid fa-arrows-rotate"></i>
          </button>
        </div>
        <!-- ko if: typeof(activeViewers) != 'undefined' -->
        <div
          id="divRequestActiveViewers"
          data-bind="visible: activeViewers.viewers().length, with: activeViewers"
        >
          <fieldset>
            <legend>
              <span class="fa-solid fa-triangle-exclamation"></span
              ><span data-bind="text: viewers().length"></span> Active Viewers
            </legend>
            <ul data-bind="foreach: viewers">
              <li>
                <div class="active-viewer">
                  <div
                    data-bind="text: viewer + ' @ ' + timestamp.toLocaleString()"
                  ></div>
                  <div
                    style="cursor: pointer"
                    data-bind="click: $parent.onRemove"
                    class="fa-solid fa-xmark"
                  ></div>
                </div>
              </li>
            </ul>
          </fieldset>
        </div>
        <!-- /ko -->
        <div class="form-row uppercase">
          <dl class="">
            <dt>Request #</dt>
            <dd data-bind="text: number"></dd>
            <dt>Subject</dt>
            <dd data-bind="text: subject"></dd>
            <dt>Requesting Office</dt>
            <dd data-bind="text: requestingOffice"></dd>
            <dt>Sensitivity</dt>
            <dd data-bind="text: sensitivity"></dd>
            <dt>Internal Due Date</dt>
            <dd data-bind="text: internalDueDate"></dd>
            <dt>Due Date</dt>
            <dd data-bind="text: dueDate"></dd>
          </dl>
          <dl>
            <dt>Type</dt>
            <dd data-bind="text: reqType"></dd>
            <dt>Status</dt>
            <dd>
              <span
                id="requestInfoStatus"
                class="uppercase"
                data-bind="text: status, class: status == 'Closed' ? 'danger' : 'success' "
              ></span>
              <span class="danger" data-bind="visible: status == 'Closed'"
                >on
                <span data-bind="text: closedDate"></span>
              </span>
            </dd>
            <dt>Sample?</dt>
            <dd>
              <span id="requestInfoSample">
                <span data-bind="if: sample"
                  ><span class="fa-solid fa-check"></span> Yes</span
                >
                <span data-bind="if: !sample"
                  ><span class="fa-solid fa-xmark"></span> No</span
                >
              </span>
            </dd>
            <dt>Receipt Date</dt>
            <dd data-bind="text: receiptDate"></dd>
            <dt>Related Audit</dt>
            <dd data-bind="text: relatedAudit"></dd>
          </dl>
        </div>
        <div class="form-row">
          <dl>
            <dt>Action Items</dt>
            <dd data-bind="html: actionItems"></dd>
            <dt>Comments</dt>
            <dd data-bind="html: comments"></dd>
          </dl>
        </div>

        <div class="form-row">
          <div class="emphasized-section">
            <div class="fw-semibold">Internal Status Comments</div>
            <!-- ko if: typeof(internalStatus) != 'undefined' -->
            <div class="commentChain" data-bind="with: internalStatus">
              <div data-bind="if: comments().length">
                <!-- ko if: showHistoryBool -->
                <!-- ko foreach: comments -->
                <div class="comment card">
                  <div class="card-body">
                    <div class="text" data-bind="text: text"></div>
                    <div>
                      <span
                        class="info"
                        data-bind="text: author + ' @ ' + timestamp.toLocaleString()"
                      ></span>
                      <button
                        type="button"
                        title="Delete Comment"
                        class="remove btn btn-link danger"
                        data-bind="click: $parent.onRemove"
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <!-- /ko -->
                <!-- /ko -->
                <!-- ko ifnot: showHistoryBool -->
                <div
                  class="comment card"
                  data-bind="with: comments()[comments().length - 1]"
                >
                  <div class="card-body">
                    <div class="text" data-bind="text: text"></div>
                    <div>
                      <span
                        class="info"
                        data-bind="text: author + ' @ ' + timestamp.toLocaleString()"
                      ></span>
                      <button
                        type="button"
                        title="Delete Comment"
                        class="remove btn btn-link danger"
                        data-bind="click: $parent.onRemove"
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <!-- /ko -->
              </div>
              <button
                type="button"
                class="btn btn-link"
                title="Show hidden comments"
                data-bind="click: toggleShowHistory"
              >
                <span class="fa-solid fa-comments"></span>
                Toggle Comment History (<span
                  data-bind="text: comments().length"
                ></span>
                Total)
              </button>
              <div class="new-comment">
                <textarea
                  class="form-control w-full"
                  cols="50"
                  data-bind="textInput: newCommentText"
                  placeholder="Leave a new comment..."
                ></textarea>
                <button
                  type="button"
                  class="btn btn-primary"
                  data-bind="click: onSubmit, enable: newCommentText"
                >
                  Submit
                </button>
              </div>
            </div>
            <!-- /ko -->
          </div>
        </div>
        <div class="form-row">
          <dl>
            <dt>Action Office(s)</dt>
            <dd>
              <!-- ko ifnot: actionOffices.length -->
              0 Action Offices
              <!-- /ko -->
              <span
                id="requestInfoActionOffice"
                data-bind="if: actionOffices.length"
              >
                <div
                  style="cursor: pointer; white-space: nowrap"
                  title="Click to view"
                >
                  <span
                    class="actionOfficeContainerRequestInfo"
                    data-bind="toggleClick: $data, toggleClass: 'collapsed', classContainer: '.sr1-request-actionOfficeContainerRequestInfo-item'"
                  >
                    <span class="fa-solid fa-magnifying-glass"></span
                    ><button type="button" class="btn btn-link">
                      View
                      <span data-bind="text: actionOffices.length"></span>
                      Action Offices
                    </button>
                    <!-- ko foreach: actionOffices -->
                    <div
                      class="sr1-request-actionOfficeContainerRequestInfo-item collapsed"
                      data-bind="text: ao"
                    ></div>
                    <!-- /ko -->
                  </span>
                </div>
              </span>
            </dd>
          </dl>
          <dl>
            <dt>Email Action Office(s)</dt>
            <dd>
              <!-- ko ifnot: emailActionOffices.length -->
              0 Email Action Offices
              <!-- /ko -->
              <span
                id="requestInfoActionOffice"
                data-bind="if: emailActionOffices.length"
              >
                <div
                  style="cursor: pointer; white-space: nowrap"
                  title="Click to view"
                >
                  <span
                    class="actionOfficeContainerRequestInfo"
                    data-bind="toggleClick: $data, toggleClass: 'collapsed', classContainer: '.sr1-request-actionOfficeContainerRequestInfo-item'"
                  >
                    <span class="fa-solid fa-magnifying-glass"></span
                    ><button type="button" class="btn btn-link">
                      View
                      <span data-bind="text: emailActionOffices.length"></span>
                      Email Action Offices
                    </button>
                    <!-- ko foreach: emailActionOffices -->
                    <div
                      class="sr1-request-actionOfficeContainerRequestInfo-item collapsed"
                      data-bind="text: ao"
                    ></div>
                    <!-- /ko -->
                  </span>
                </div>
              </span>
            </dd>
          </dl>
        </div>
        <div class="form-row">
          <dl>
            <dt>Email Sent?</dt>
            <dd>
              <span data-bind="if: emailSent"
                ><span class="fa-solid fa-check"></span> Yes</span
              >
              <span data-bind="if: !emailSent"
                ><span class="fa-solid fa-xmark"></span> No</span
              >
            </dd>
          </dl>
          <fieldset
            class="emphasized-section"
            style="
            width: 225px;
            margin-top: 5px;
            margin-left: 10px;
            padding-left: 10px;
          "
          >
            <legend>Email Actions</legend>
            <div
              id="divSendEmailAction"
              style="padding-top: 5px"
              data-bind="visible: status == 'Open' || status == 'ReOpened'"
            >
              <span class="fa-solid fa-paper-plane"></span>
              <button
                type="button"
                class="btn btn-link"
                data-bind="visible: !emailSent, click: $root.ClickSendEmail, enable: emailActionOffices.length"
                title="Send Email to Action Offices"
              >
                Send Email to Action Offices
              </button>
              <button
                type="button"
                class="btn btn-link"
                data-bind="visible: emailSent, click: $root.ClickSendEmail, enable: emailActionOffices.length"
                title="ReSend Email to Action Offices"
              >
                Re-Send Email to Action Offices
              </button>
            </div>
            <div id="divEmailHistory" style="padding-top: 5px">
              <button
                type="button"
                class="btn btn-link"
                title="View Email History"
                data-bind="click: $root.ClickViewEmailHistoryFolder"
              >
                <span class="fa-solid fa-magnifying-glass"></span> View Email
                History
              </button>
            </div>
            <div id="divSyncEmailActionOffices" style="padding-top: 5px">
              <button
                type="button"
                class="btn btn-link"
                title="Synchronize Email Action Offices"
                data-bind="click: $root.ClickSyncEmailActionOffices"
              >
                <span class="fa-solid fa-right-left"></span> Synchronize Email
                Action Offices
              </button>
            </div>
          </fieldset>
        </div>
        <div class="form-row">
          <dl>
            <dt>Special Permissions?</dt>
            <dd>
              <span data-bind="if: specialPerms == true"
                ><span class="fa-solid fa-check"></span> Yes</span
              >
              <span data-bind="if: specialPerms == false"
                ><span class="fa-solid fa-xmark"></span> No</span
              >
            </dd>
          </dl>
          <fieldset
            class="emphasized-section"
            style="
            width: 200px;
            margin-top: 5px;
            margin-left: 10px;
            padding-left: 10px;
          "
          >
            <legend>Special Permission Actions</legend>
            <div
              id="divResponsesGrantSpecialPermissions"
              style="padding-top: 5px"
            >
              <button
                type="button"
                class="btn btn-link"
                title="Grant Special Permissions"
                data-bind="click: $root.ClickGrantSpecialPermissions"
              >
                <span class="fa-solid fa-unlock"></span> Grant Special
                Permissions
              </button>
            </div>
            <div
              id="divResponsesRemoveSpecialPermissions"
              style="padding-top: 5px"
            >
              <button
                type="button"
                class="btn btn-link"
                title="Remove Special Permissions"
                data-bind="click: $root.ClickRemoveSpecialPermissions"
              >
                <span class="fa-solid fa-lock"></span> Remove Special
                Permissions
              </button>
            </div>
          </fieldset>
        </div>
        <tr></tr>

        <div id="divRequestInfoActions" class="form-row">
          <fieldset class="form-actions emphasized-section">
            <legend>Request Actions</legend>
            <div>
              <button
                type="button"
                class="btn btn-primary"
                title="View Version History"
                data-bind="click: $parent.ClickViewRequestHistory"
              >
                <span class="fa-solid fa-clock-rotate-left"></span> View Version
                History
              </button>
            </div>
            <div>
              <button
                type="button"
                class="btn btn-primary"
                title="View Request"
                data-bind="click: $root.ClickViewRequest"
              >
                <span class="fa-solid fa-magnifying-glass"></span> View Request
              </button>
            </div>
            <div>
              <button
                type="button"
                class="btn btn-success"
                title="Edit Request"
                data-bind="click: $root.ClickEditRequest"
              >
                <span class="fa-solid fa-pencil"></span> Edit Request
              </button>
            </div>
            <!-- ko ifnot: emailSent  -->
            <div>
              <button
                type="button"
                class="btn btn-danger"
                title="Delete Request"
                data-bind="click: $parent.ClickDeleteRequest"
              >
                <span class="fa-solid fa-trash"></span> Delete Request
              </button>
            </div>
            <!-- /ko -->
          </fieldset>
        </div>
      </div>
    </div>

    <div class="ui-tabs-secondary request-detail-documents">
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
        data-bind="component: {
            name: template.id,
            params: template.data
          },
          visible: $parent.isSelected($data)"
      ></div>
      <!-- /ko -->
      <!-- /ko -->
    </div>
  </div>
`;te();var gr=ce`
  <div id="divCoverSheets" data-bind="visible: currentRequest">
    <div id="divCoverSheetActions" class="w-fit">
      <div data-bind="visible: coverSheetFiles().length">
        Uploading Coversheet!
        <progress></progress>
      </div>
      <div class="quick-links secondary">
        <label data-bind="visible: !coverSheetFiles().length">
          <div
            class="btn btn-link"
            title="Upload Cover Sheet or Supplemental Document"
            data-bind=""
          >
            <span class="fa-solid fa-upload"></span> Upload Cover Sheet or
            Supplemental Document
          </div>
          <input
            style="display: none"
            type="file"
            data-bind="files: coverSheetFiles"
          />
        </label>
      </div>
    </div>
    <div
      id="divEmptyCoversheetsMsg"
      style="border: 0px !important; font-style: italic"
      data-bind="visible: arrCurrentRequestCoverSheets().length <= 0"
    >
      There are 0 coversheets
    </div>
    <table
      id="tblCoverSheets"
      class="tablesorter report"
      data-bind="visible: arrCurrentRequestCoverSheets().length > 0"
    >
      <thead>
        <tr valign="top">
          <th class="sorter-false" nowrap="nowrap">Name</th>
          <th class="sorter-false" nowrap="nowrap">Action Office</th>
          <th class="sorter-false" nowrap="nowrap">Action</th>
        </tr>
      </thead>
      <tbody data-bind="foreach: arrCurrentRequestCoverSheets">
        <tr class="coversheet-item">
          <td class="coversheet-title" title="Click to Download">
            <a
              class="btn btn-link"
              data-bind="downloadLink: '../_layouts/download.aspx?SourceUrl=:folder/:title'"
              ><span data-bind="text: title"></span
            ></a>
          </td>
          <td class="coversheet-ao">
            <div
              style="cursor: pointer"
              title="Click to view"
              data-bind="visible: $data.actionOffices.length > 0, toggleClick: $data, toggleClass: 'collapsed', classContainer: '.sr1-request-actionOfficeContainerRequestInfo-item'"
            >
              <span class="fa-solid fa-magnifying-glass"></span
              ><span class="actionOfficeContainerRequestInfo"
                ><button type="button" class="btn btn-link">
                  View Action Offices
                </button></span
              >
              <!-- ko foreach: actionOffices -->
              <div
                class="sr1-request-actionOfficeContainerRequestInfo-item collapsed"
              >
                <span data-bind="text: actionOffice"></span>
              </div>
              <!-- /ko -->
            </div>
          </td>
          <td class="coversheet-action">
            <button
              type="button"
              class="btn btn-link"
              title="View Coversheet"
              data-bind="click: $root.ClickViewCoversheet"
            >
              <span
                title="View Coversheet"
                class="fa-solid fa-magnifying-glass"
              ></span>
            </button>
            <button
              type="button"
              class="btn btn-link"
              title="Edit Coversheet"
              data-bind="visible: requestStatus != 'Closed' && requestStatus != 'Canceled', click: $root.ClickEditCoversheet"
            >
              <span title="Edit Coversheet" class="fa-solid fa-pencil"></span>
            </button>
            <button
              type="button"
              class="btn btn-link"
              title="Delete Coversheet"
              data-bind="visible: requestStatus != 'Closed' && requestStatus != 'Canceled',
                click: $parent.ClickDeleteCoversheet"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr valign="top">
          <th nowrap="nowrap" colspan="3">
            Total:
            <span
              id="tblCoverSheetsTotal"
              data-bind="text: arrCurrentRequestCoverSheets().length"
              >0</span
            >
          </th>
        </tr>
      </tfoot>
    </table>
  </div>
`;te();var hr=ce`
  <div id="divResponses" data-bind="visible: currentRequest">
    <div data-bind="">
      <div id="divResponsesActions" class="quick-links secondary">
        <!-- ko if:  showResponseActions-->
        <div>
          <button
          type="button"
          class="btn btn-link"
            title="Add Response"
            data-bind="click: $root.ClickAddResponse"
            ><span class="fa-solid fa-plus"></span>Add Response</button
          >
        </div>
        <div>
          <button
            type="button"
            class="btn btn-link"
            title="Bulk Add Responses"

            data-bind="click: $root.ClickBulkAddResponse"
            ><span class="fa-solid fa-circle-plus"></span>Bulk Add Responses</a
          >
        </div>
        <div data-bind="visible: currentRequestResponseItems().length > 0">
          <button
            type="button"
            class="btn btn-link"
            title="Bulk Edit Responses"

            data-bind="click: $root.ClickBulkEditResponse"
            ><span class="fa-solid fa-pencil"></span>Bulk Edit Responses</a
          >
        </div>
        <!-- /ko -->
        <div
          id="divResponsesShowHideFolderPerms"
          data-bind="visible: currentRequestResponseItems().length > 0"
        >
          <button
            type="button"
            class="btn btn-link"
            title="Show/Hide Response Folder Permissions"
            data-bind="toggleClick: $data, toggleClass: 'response-permissions', containerType: 'any'"
            ><i class="fa-solid fa-gear"></i>Show/Hide Response Folder
            Permissions</a
          >
        </div>
      </div>
    </div>

    <table
      id="tblResponses"
      class="tablesorter report"
      data-bind="visible: currentRequestResponseItems().length > 0 "
    >
      <thead>
        <tr valign="top">
          <th class="sorter-true" nowrap="nowrap">Sample #</th>
          <th class="sorter-true" nowrap="nowrap" style="text-align: left">
            Name
          </th>
          <th class="sorter-true" nowrap="nowrap">Action Office</th>
          <th class="sorter-true" nowrap="nowrap"># Docs</th>
          <th class="sorter-true" nowrap="nowrap">Status</th>
          <th class="sorter-true" nowrap="nowrap">Return Reason</th>
          <th class="sorter-false" nowrap="nowrap">Special Permission?</th>
          <th class="sorter-false response-permissions" nowrap="nowrap">
            Response Folder Permissions
          </th>
          <th class="sorter-false" nowrap="nowrap">Active Viewers</th>
          <th class="sorter-false" nowrap="nowrap">Action</th>
          <th class="sorter-false" nowrap="nowrap">Documents</th>
        </tr>
      </thead>
      <tbody data-bind="foreach: currentRequestResponseItems">
        <tr class="response-item" data-bind="css: {'highlighted': highlight}">
          <td class="response-sample">
            <span data-bind="text: sample"></span>
          </td>
          <td
            class="response-title"
            data-bind="attr: {'id': 'response-item-title-' + title}, click: highlightResponse"
          >
            <span title="View Response Docs" class="btn btn-link" data-bind="text: title, click: $parent.viewResponseDocs"></span>
          </td>
          <td
            class="response-actionOffice"
            data-bind="attr: {'title': toolTip}, style: styleTag"
          >
            <span data-bind="text: actionOffice"></span
            ><span data-bind="visible: poc" style="color: green"
              >&nbsp;POC: </span
            ><span data-bind="text: poc" style="color: green"></span>
          </td>
          <td class="response-document-cnt" >
            <span title="View Response Docs"
              class="btn btn-link"
              data-bind="text: responseDocs.length, click: $parent.viewResponseDocs"></span>
          </td>
          <td class="response-resStatus">
            <span
              data-bind="visible: resStatus != '7-Closed'"
              style="color: green"
              ><span data-bind="text: resStatus"></span>
            </span>
            <span
              data-bind="visible: resStatus == '7-Closed'"
              style="color: red"
              ><span data-bind="text: resStatus"></span>&nbsp;on&nbsp;<span
                data-bind="text: closedDate"
              ></span
              >&nbsp;by&nbsp;<span data-bind="text: closedBy"></span
            ></span>
              <!-- ko if: isReadyToClose($data) -->
              <button type="button"
                class="btn btn-link"
                title="All response docs sent to RO. Click to Close."
                data-bind="click: clickCloseResponse">
                Ready to Close <span class="fa-solid fa-circle-check"></span>
              </button>
              <!-- /ko -->
            <div
              style="padding-top: 5px; padding-left: 20px"
              data-bind="visible: resStatus == '7-Closed'"
            >
              <i class="fa-solid fa-gear"></i
              ><button
            type="button"
            class="btn btn-link"
                title="Click to Open Response"

                data-bind="click: $root.ClickReOpenResponse"
                >Open Response?</a
              >
            </div>
          </td>
          <td class="response-returnReason" style="white-space: pre-line">
            <span data-bind="text: returnReason"></span>
          </td>
          <td class="response-specialPermissions">
            <span
              data-bind="css: (specialPerms ? 'fa-solid fa-check' : '')"
            ></span>
          </td>
          <td class="response-permissions">
            <span data-bind="html: groupPerms"></span>
          </td>
          <td class="response-viewers">
            <div
              data-bind="visible: activeViewers.viewers().length, with: activeViewers"
            >
              <fieldset>
                <legend>
                  <i class="fa-solid fa-triangle-exclamation"></i
                  ><span data-bind="text: viewers().length"></span>
                  Active Viewers
                </legend>
                <ul data-bind="foreach: viewers">
                  <li>
                    <div class="active-viewer">
                      <div
                        data-bind="text: viewer + ' @ ' + timestamp.toLocaleString()"
                      ></div>
                      <div
                        style="cursor: pointer"
                        data-bind="click: $parent.onRemove"
                      >
                        <i class="fa-solid fa-xmark"></i>
                      </div>
                    </div>
                  </li>
                </ul>
              </fieldset>
            </div>
          </td>
          <td class="response-action">
            <button
              type="button"
              class="btn btn-link"
              title="View Response"
              data-bind="click: $root.ClickViewResponse"
            >
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
            <button
              type="button"
              class="btn btn-link"
              title="Edit Response"
              data-bind="visible: resStatus != '7-Closed' && $parent.status != 'Closed' && $parent.status != 'Canceled', click: $root.ClickEditResponse"
            >
              <i class="fa-solid fa-pen"></i>
            </button>
            <button
              type="button"
              class="btn btn-link"
              title="View Version History"
              data-bind="click: ClickViewResponseHistory"
            >
              <span class="fa-solid fa-clock-rotate-left"></span>
            </button>
            <label
              title="Upload Coversheets for Action Office"
              class="btn btn-link"
              data-bind="visible: $parent.status != 'Closed' && $parent.status != 'Canceled' && ( resStatus == '1-Open' || resStatus == '2-Submitted' || resStatus == '3-Returned to Action Office' ||resStatus == '5-Returned to GFS' )"
            >
              <i
                title="Upload Coversheets"
                class="fa-solid fa-upload"
              ></i>
              <input
                type="file"
                multiple
                style="display: none"
                data-bind="files: responseCoversheetFiles"
              />
            </label>
            <button
              type="button"
              class="btn btn-link"
              title="Flag Response as Under Review"
              data-bind="visible: resStatus != '7-Closed' && $parent.status != 'Closed' && $parent.status != 'Canceled', click: $root.ClickReviewingResponse"
            >
              <i class="fa-solid fa-flag"></i>
            </button>
            <button
              type="button"
              class="btn btn-link"
              title="Delete Response"
              data-bind="visible: $parent.status != 'Closed' && $parent.status != 'Canceled' && ( resStatus == '1-Open' || resStatus == '2-Submitted' || resStatus == '3-Returned to Action Office' || resStatus == '5-Returned to GFS' ),
                click: ClickDeleteResponse"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
          <td class="response-responseDocs">
            <button
              type="button"
              class="btn btn-link"
              title="View Response Documents"
              data-bind="visible: resStatus != '7-Closed' && $parent.status != 'Closed' && $parent.status != 'Canceled', click: $root.ClickViewResponseDocFolder"
            >
              <i class="fa-solid fa-folder-open"></i>
            </button>
            <label
              class="btn btn-link"
              title="Upload Response Documents"
              data-bind="visible: $parent.status != 'Closed' && $parent.status != 'Canceled' && ( resStatus == '1-Open' || resStatus == '2-Submitted' || resStatus == '3-Returned to Action Office' ||resStatus == '5-Returned to GFS' )"
              ><i class="fa-solid fa-file-arrow-up"></i>
              <input
                type="file"
                multiple
                style="display: none"
                data-bind="files: responseDocFiles"
              />
            </label>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr valign="top">
          <th colspan="10" nowrap="nowrap">
            Total:
            <span
              id="tblResponsesTotal"
              data-bind="text: currentRequestResponseItems().length"
              >0</span
            >
          </th>
        </tr>
      </tfoot>
    </table>
  </div>
`;te();var vr=ce`
  <div id="divResponseDocs" data-bind="visible: currentRequest">
    <div
      id="divEmptyResponseDocsMsg"
      style="border: 0px !important; font-style: italic"
      data-bind="visible: cntResponseDocs() == 0"
    >
      There are 0 response documents
    </div>

    <div
      class="quick-links secondary"
      data-bind="visible: cntResponseDocs() > 0"
    >
      <div>
        <button
            type="button"
            class="btn btn-link"
          class="btnApprovedCheckedResponseDocs"

          title="Approve Checked Response Documents"
          data-bind="click: ApproveCheckedResponseDocs, visible: currentRequest() && (currentRequest().status == 'Open' || currentRequest().status == 'ReOpened')"
        >
          <span class="fa-solid fa-circle-check"></span>
          Approve Checked Response Documents
        </button>
      </div>
      <div>
        <button
            type="button"
            class="btn btn-link"
          class="btnCheckResponseDocs"

          title="Check/Un-Check Response Documents"
          data-bind="click: CheckResponseDocs, visible: currentRequest() && (currentRequest().status == 'Open' || currentRequest().status == 'ReOpened')"
        >
          <span class="fa-solid fa-check-double"></span>
          Check Response Documents
        </button>
      </div>
      <div>
        <button
            type="button"
            class="btn btn-link"
          class="btnToggleExpand"

          title="Click to Expand/Collapse"
          data-bind="toggles: showCollapsed"
        >
          <span
            class="fa-solid"
            data-bind="class: showCollapsed() ? 'fa-expand' : 'fa-compress'"
          ></span>
          <span
            data-bind="text: showCollapsed() ? 'Expand Documents' : 'Collapse Documents'"
          ></span>
        </button>
      </div>
    </div>

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
          <th class="sorter-false" nowrap="nowrap">Checked Out</th>
          <th class="sorter-false" nowrap="nowrap">
            Status
            <span class="linkHelpResponseDocs"
              ><button
            type="button"
            class="btn btn-link"
                title="View Help"
                data-bind="click: clickHelpResponseDocs"
                style="color: #0072bc"
                ><i class="fa-solid fa-question"></i></a
            ></span>
          </th>
          <th class="sorter-false" nowrap="nowrap">Reason</th>
          <th class="sorter-false" nowrap="nowrap">Modified</th>
          <th class="sorter-false" nowrap="nowrap">Modified By</th>
          <th class="sorter-false" nowrap="nowrap">Actions</th>
        </tr>
      </thead>
      <tbody
        data-bind="foreach: { data: currentRequestResponseDocs, as: 'responseDocSummary'} "
      >
        <tr
          class="requestInfo-response-doc"
          data-bind="visible: responseDocSummary.responseDocs.length > 0,
            attr: {id: responseDocSummary.titleRowElementId() }"
        >
          <td colspan="11">
            <img
              style="background-color: transparent"
              title="Expand/Collapse"
              data-bind="
              attr: { src: (responseDocSummary.collapsed() ? '/_layouts/images/plus.gif' : '/_layouts/images/minus.gif') },
              toggles: responseDocSummary.collapsed"
            /><span>
              <button type="button"
                class="btn btn-link"
                title="View Response"
                data-bind="text: responseDocSummary.responseTitle,
                  click: $parent.ClickViewResponse">
              </button>
              </span>
              (<span data-bind="text: responseStatus"></span>)
          </td>
        </tr>

        <tr
          class="requestInfo-response-doc-item"
          data-bind="visible: responseDocSummary.showBulkApprove,
            css: (responseDocSummary.collapsed() ? 'collapsed' : '')"
        >
          <td colspan="11">
            <span class="divBulkApprove">
              <button
                type="button"
                class="btn btn-link"
                class="btnApproveAll"

                title="Click to Approve Remaining Documents"
                data-bind="click: $parent.ClickBulkApprove"
              >
                <span class="fa-solid fa-circle-check"></span>
                Approve 'Submitted' Documents for this Response below
              </button>
            </span>
          </td>
        </tr>

        <!-- ko foreach: responseDocSummary.responseDocs-->

        <tr
          class="requestInfo-response-doc-item"
          data-bind="style: styleTag,
          css: {'collapsed': responseDocSummary.collapsed(), 'highlighted': responseDocSummary.highlight}"
        >
          <td>
            <img
              data-bind="attr:{ src: $parent.siteUrl + '/_layouts/images/' + docIcon}"
            />
          </td>
          <td class="requestInfo-response-doc-title">
            <input
              type="checkbox"
              data-bind="attr: { id: ID }, visible: $parent.responseDocCanBeApproved($data), checked: chkApproveResDoc"
            />

            <a
              title="Click to Download"
              data-bind="visible: $parent.responseStatus == '7-Closed' || $parent.requestStatus == 'Closed' || $parent.requestStatus == 'Canceled', downloadLink: '../_layouts/download.aspx?SourceUrl=:folder/:fileName'"
              ><span data-bind="text: fileName"></span
            ></a>
            <span
              title="Click to Open"
              data-bind="visible: $parent.responseStatus != '7-Closed' && $parent.requestStatus != 'Closed' && $parent.requestStatus != 'Canceled', html: responseDocOpenInIELink "
            ></span>
            <span
              style="float: right"
              data-bind="visible: ( documentStatus == 'Open' || documentStatus == 'Marked for Deletion') && ($parent.requestStatus == 'Open' || $parent.requestStatus == 'ReOpened') "
              ><button
            type="button"
            class="btn btn-link"
                title="Delete Response Document"

                data-bind="click: $root.ClickDeleteResponseDoc"
                ><i class="fa-solid fa-trash"></i></a
            ></span>
          </td>
          <td nowrap data-bind="text: title"></td>
          <td nowrap data-bind="text: receiptDate"></td>
          <td nowrap data-bind="text: fileSize"></td>
          <td nowrap>
            <span data-bind="visible: checkedOutBy != ''"
              ><span data-bind="text: checkedOutBy"></span>&nbsp;<img
                style="background-color: transparent"
                src="/_layouts/images/checkin.gif"
                title="Check In Document"
              /><button
            type="button"
            class="btn btn-link"

                title="Check In Document"
                data-bind="click: $root.ClickCheckInResponseDocument"
                >Check In Document</a
              ></span
            >
          </td>
          <td nowrap>
            <span data-bind="text: documentStatus"></span>
            <span
              data-bind="visible: documentStatus == 'Rejected' && ( $parent.requestStatus == 'Open' || $parent.requestStatus == 'ReOpened' ) "
              ><button
            type="button"
            class="btn btn-link"
                title="Clear Rejected Status"

                data-bind="click: $root.ClickResendRejectedResponseDocToQA"
                ><i class="fa-solid fa-circle-check"></i></a
            ></span>
          </td>
          <td data-bind="html: rejectReason"></td>
          <td
            class="requestInfo-response-doc-modified"
            data-bind="text: modifiedDate"
          ></td>
          <td
            class="requestInfo-response-doc-modifiedBy"
            data-bind="text: modifiedBy"
          ></td>
          <td nowrap>
            <span
              data-bind="visible: $parent.responseDocCanBeApproved($data)"
            >
              <button
                type="button"
                class="btn btn-link"
                title="Approve this Document"

                data-bind="click: $parents[1].ClickApproveResponseDoc"
              >
                <span class="fa-solid fa-circle-check"
                  ></span
                >
              </button>
              <button
                type="button"
                class="btn btn-link"
                title="Reject this Document"

                data-bind="click: $parents[1].ClickRejectResponseDoc"
              >
                <span class="fa-solid fa-circle-xmark"
                  ></span
                >
              </button>
            </span>

            <a
              title="Click to Download"
              data-bind="downloadLink: '../_layouts/download.aspx?SourceUrl=:folder/:fileName'"
              ><i class="fa-solid fa-download"></i
            ></a>
            <button
              type="button"
              class="btn btn-link"
              title="View Response Document Properties"

              data-bind="click: $root.ClickViewResponseDoc"
              ><span class="fa-solid fa-magnifying-glass"
                ></span
              ></a
            >
            <button
              type="button"
              class="btn btn-link"
              title="Edit Response Document Properties"

              data-bind="visible: $parent.responseStatus != '7-Closed' && $parent.requestStatus != 'Closed' && $parent.requestStatus != 'Canceled' && ( documentStatus == 'Sent to QA' || documentStatus == 'Open' || documentStatus == 'Submitted' ), click: $root.ClickEditResponseDoc"
              ><span class="fa-solid fa-pencil"></span></a
            >
            <button
              type="button"
              class="btn btn-link"
              title="View Version History"
              data-bind="click: $parent.ClickViewResponseDocHistory"
            >
              <span class="fa-solid fa-clock-rotate-left"></span>
            </button>
          </td>
        </tr>

        <!-- /ko -->
      </tbody>
      <tfoot>
        <tr valign="top">
          <th colspan="11" nowrap="nowrap">
            Total:
            <span id="tblResponseDocsTotal" data-bind="text: cntResponseDocs()"
              >0</span
            >
          </th>
        </tr>
      </tfoot>
    </table>
  </div>
`;var br="component-request-detail-view",zi="request-detail-tab",vi=class{constructor({bDisplayClose:e,currentRequest:s,arrCurrentRequestCoverSheets:n,ModalDialog:o,ClickEditCoversheet:r}){this.bDisplayClose=e,this.currentRequest=s,this.arrCurrentRequestCoverSheets=n,this.editCoversheet=r,this.ModalDialog=o,this.showCollapsed.subscribe(this.showCollapseToggledHandler),this.coverSheetFiles.subscribeAdded(this.onCoverSheetFileAttachedHandler),this.tabs=new rs(Object.values(this.tabOpts),zi),this.setInitialTab(),this.currentRequest.subscribe(this.onRequestChangeHandler)}request=ko.observable();onRequestChangeHandler=async e=>{if(!e||!e.ID||e.ID==ko.unwrap(this.request)?.ID)return;let s=await _s(e.ID);this.request(s)};componentName=br;params=this;tabOpts={Coversheets:new bt("coversheets","Coversheets",{id:"requestDetailCoversheetsTabTemplate",data:this}),Responses:new bt("responses","Responses",{id:"requestDetailResponsesTabTemplate",data:this}),ResponseDocs:new bt("response-docs","Response Docs",{id:"requestDetailResponseDocsTabTemplate",data:this})};checkResponseDoc=!0;coverSheetFiles=ko.observableArray();showCollapsed=ko.observable(!1);currentRequestResponseItems=ko.pureComputed(()=>{let e=ko.unwrap(this.currentRequest);return e?.responses.map(s=>new Ji(e,s,this))??[]});currentRequestResponsesReadyToClose=ko.pureComputed(()=>this.currentRequest()?.reqType!=it.TASKER?[]:this.currentRequestResponseItems().filter(e=>e.isReadyToClose()));currentRequestResponseDocs=ko.pureComputed(()=>{let e=ko.unwrap(this.currentRequest);return e?.responses.map(n=>new Zi(e,n))??[]});cntResponseDocs=ko.pureComputed(()=>this.currentRequestResponseDocs().reduce((s,n)=>s+n.responseDocs.length,0));showResponseActions=ko.pureComputed(()=>[nt.OPEN,nt.REOPENED].includes(this.currentRequest()?.status));showCollapseToggledHandler=e=>{this.currentRequestResponseDocs().map(s=>s.collapsed(e))};setInitialTab(){if(ri(zi)){this.tabs.selectById(ri(zi));return}let e=this.currentRequest()?.EmailSent.Value()?this.tabOpts.Responses:this.tabOpts.Coversheets;this.tabs.selectTab(e)}ClickViewRequestHistory=()=>{T.AuditRequests.ListRef.showVersionHistoryModal(this.currentRequest()?.ID)};ClickDeleteRequest=async()=>{let e=this.currentRequest();if(e.emailSent){alert("Email has been sent, cannot delete request.");return}let n={form:new hi(e),dialogReturnValueCallback:this.OnCallBackDeleteRequest.bind(this),title:"Delete Request?"};Le(n)};refreshRequest=async()=>{Ne();let e=ko.unwrap(this.request)?.ID;if(!e)return;let s=await _s(e);this.request(s)};onCoverSheetFileAttachedHandler=async e=>{if(!e.length)return;let s=await T.AuditRequests.FindById(this.currentRequest().ID),n=e[0],o=await Ki(n,s);this.coverSheetFiles([]),this.editCoversheet({ID:o.ID})};ClickDeleteCoversheet=async e=>{confirm("Delete coversheet: "+e.title)&&(await $o(e.ID),this.refreshRequest())};clickCloseReadyResponses=async()=>{await Promise.all(this.currentRequestResponsesReadyToClose().map(e=>e.closeResponse())),this.refreshRequest()};viewResponseDocs=e=>{this.tabs.selectTab(this.tabOpts.ResponseDocs),this.showCollapsed(!0),this.showCollapsed.valueHasMutated();let s=this.currentRequestResponseDocs().find(n=>n.responseTitle==e.title);s&&(s.collapsed(!1),s.highlightResponse())};highlightResponse=e=>{this.tabs.selectTab(this.tabOpts.Responses),this.currentRequestResponseItems().find(s=>s.title==e)?.highlightResponse()};clickHelpResponseDocs=()=>{var e="<div id='helpDlg' style='padding:20px; height:100px; width:700px'><div style='padding:20px;'><fieldset><legend>Response Document Status</legend> <ul style='padding-top:10px;'><li style='padding-top:5px;'><b>Open</b> - Uploaded by the Action Office but not yet submitted to the Internal Auditor</li><li style='padding-top:5px;'><b>Submitted</b> - Submitted to the Internal Auditor by the Action Office</li><li style='padding-top:5px;'><b>Sent to QA</b> - Submitted to the Quality Assurance team by the Internal Auditor</li><li style='padding-top:5px;'><b>Approved</b> - Approved by the Quality Assurance team and submitted to the External Auditor</li><li style='padding-top:5px;'><b>Rejected</b> - Rejected by the Quality Assurance team and returned to the Internal Auditor</li><li style='padding-top:5px;'><b>Archived</b> - Previously Rejected by the Quality Assurance team and is now read-only for record keeping</li></ul></fieldset></div><table style='padding-top:10px; width:200px; float:right;'><tr><td class='ms-separator'>&#160;</td><td><input id='btnCancel' type='button' class='ms-ButtonHeightWidth' value='Close' title='Close Help' onclick='SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)'/></td></tr></table></div>";$("body").append(e);var s=SP.UI.$create_DialogOptions();s.title="Response Documents Help",s.height=300,s.html=document.getElementById("helpDlg"),SP.UI.ModalDialog.showModalDialog(s)};ClickBulkApprove=e=>{let s=e.responseDocs.filter(a=>this.responseDocCanBeApproved(e,a)),n=this.currentRequest(),r={form:new ls(n,null,s),dialogReturnValueCallback:this.OnCallBackApproveResponseDoc.bind(this),title:"Approve Response Docs?"};Le(r)};ClickApproveResponseDoc=e=>{let s=this.currentRequest(),o={form:new ls(s,null,[e]),dialogReturnValueCallback:this.OnCallBackApproveResponseDoc.bind(this),title:"Approve Response Doc?"};Le(o)};CheckResponseDocs=()=>{let e=this.currentRequestResponseDocs().filter(s=>s.responseStatus=="2-Submitted").flatMap(s=>s.responseDocs).filter(s=>s.documentStatus=="Submitted").map(s=>s.chkApproveResDoc(this.checkResponseDoc));this.checkResponseDoc=!this.checkResponseDoc};ApproveCheckedResponseDocs=()=>{let e=this.currentRequestResponseDocs().flatMap(r=>r.responseDocs).filter(r=>r.chkApproveResDoc()),s=this.currentRequest(),o={form:new ls(s,null,e),dialogReturnValueCallback:this.OnCallBackApproveResponseDoc.bind(this),title:"Approve Response Docs?"};Le(o)};responseDocCanBeApproved=(e,s)=>s.documentStatus==Xe.Submitted&&(e.responseStatus==Re.Submitted||e.responseStatus==Re.ApprovedForQA)&&(e.requestStatus==nt.OPEN||e.requestStatus==nt.REOPENED);async OnCallBackApproveResponseDoc(e){e&&await this.refreshRequest()}async OnCallBackDeleteRequest(e){e&&(alert("request deleted!"),Audit.Common.Utilities.Refresh(!0))}ClickRejectResponseDoc=e=>{let s=this.currentRequest(),o={form:new gi(s,null,[e]),dialogReturnValueCallback:this.OnCallbackRejectResponseDoc.bind(this),title:"Reject Response Doc?"};Le(o)};async OnCallbackRejectResponseDoc(e){e&&this.refreshRequest()}ClickViewResponse=e=>{this.highlightResponse(e.responseTitle)}};he(br,{template:fr});he("requestDetailCoversheetsTabTemplate",{template:gr});he("requestDetailResponsesTabTemplate",{template:hr});he("requestDetailResponseDocsTabTemplate",{template:vr});var Ji=class{constructor(e,s,n){Object.assign(this,s),this.request=e,this.refreshData=n.refreshRequest,this.responseCoversheetFiles.subscribeAdded(this.onCoversheetFilesAttachedHandler),this.responseDocFiles.subscribeAdded(this.onResponseDocFilesAttachedHandler)}highlight=ko.observable(!1);responseCoversheetFiles=ko.observableArray();responseDocFiles=ko.observableArray();isReadyToClose=()=>this.request.reqType==it.TASKER&&this.resStatus!=Re.Closed&&this.responseDocs.length&&!this.responseDocs.find(e=>[Xe.Open,Xe.Submitted].includes(e.documentStatus));clickCloseResponse=async()=>{await this.closeResponse(),this.refreshData()};closeResponse=()=>sr(this.ID);ClickViewResponseHistory=()=>{T.AuditResponses.ListRef.showVersionHistoryModal(this.ID)};ClickDeleteResponse=async()=>{if(confirm("Delete Response: "+this.title)){let e=await T.AuditResponses.FindById(this.ID);await er(e),this.refreshData()}};onCoversheetFilesAttachedHandler=async e=>{if(!e.length)return;let s=await Wo(this.number),n=this.item.get_item("ActionOffice")?.get_lookupId(),o=[];n&&o.push({ID:n});let r=[];for(let a of e)r.push(new Promise(async l=>{let u=await Ki(a,s,o);l()}));await Promise.all(r),this.responseCoversheetFiles.removeAll(),this.refreshData()};onResponseDocFilesAttachedHandler=async e=>{if(!e.length)return;let s=await T.AuditResponses.FindById(this.ID),n=[];for(let o of e)n.push(new Promise(async r=>{let a=await ir(s,o);r()}));await Promise.all(n),this.responseDocFiles.removeAll(),this.refreshData()};highlightResponse=()=>{document.getElementById(`response-item-title-${this.title}`)?.scrollIntoView({block:"center",behavior:"smooth"}),this.highlight(!0),setTimeout(()=>this.highlight(!1),2e3)}},sl=`onclick="return DispEx(this,event,'TRUE','FALSE','FALSE','SharePoint.OpenDocuments.3','1','SharePoint.OpenDocuments','','','','2','0','0','0x7fffffffffffffff','','')"`,Zi=class{constructor(e,s){for(var n=!1,o=new Array,r=0;r<s.responseDocs.length;r++){var a=s.responseDocs[r];a.chkApproveResDoc=ko.observable(!1),a.documentStatus!="Marked for Deletion"&&(a.docIcon=a.docIcon.get_value(),a.styleTag=Audit.Common.Utilities.GetResponseDocStyleTag2(a.documentStatus),a.requestID=e.ID,a.responseID=s.ID,a.responseTitle=s.title,a.responseDocOpenInIELink=`<a class='btn btn-link' target='_blank' title='Click to Open the document' onmousedown="return VerifyHref(this,event,'1','SharePoint.OpenDocuments','')" `+sl+' href="'+a.folder+"/"+a.fileName+'">'+a.fileName+"</a>",o.push(a),[Re.Submitted,Re.ApprovedForQA].includes(s.resStatus)&&a.documentStatus==Xe.Submitted&&(n=!0))}this.responseId=s.ID,this.responseTitle=s.title,this.responseDocs=o,this.responseStatus=s.resStatus,this.requestStatus=e.status,this.showBulkApprove=n}responseTitle;collapsed=ko.observable(!1);highlight=ko.observable(!1);titleRowElementId=()=>"response-doc-summary-"+this.responseTitle;highlightResponse=()=>{document.getElementById(this.titleRowElementId()).scrollIntoView({behavior:"smooth",block:"center"}),this.highlight(!0),setTimeout(()=>this.highlight(!1),2e3)};ClickViewResponseDocHistory=e=>{T.AuditResponseDocs.ListRef.showVersionHistoryModal(e.ID)};responseDocCanBeApproved=e=>e.documentStatus!=Xe.Submitted?!1:(this.responseStatus==Re.Submitted||this.responseStatus==Re.ApprovedForQA)&&(this.requestStatus==nt.OPEN||this.requestStatus==nt.REOPENED)};te();var Rr=ce`
  <div class="audit-form bg-dark">
    <div class="form-fields" data-bind="foreach: FormFields">
      <!-- ko if: $parent.fieldIsEditable($data) -->
      <div
        class="form-field-component"
        data-bind="component: {
              name: components.edit, params: $data}, 
              class: classList"
      ></div>
      <!-- /ko -->
      <!-- ko ifnot: $parent.fieldIsEditable($data) -->
      <div
        class="form-field-component"
        data-bind="component: {
                name: components.view, params: $data}, 
                class: classList"
      ></div>
      <!-- /ko -->
    </div>
    <div class="form-actions">
      <!-- <button type="button" class="btn btn-warn" data-bind="click: clearForm">
      Clear Form
    </button> -->
      <button
        type="button"
        class="btn btn-success"
        data-bind="click: clickSubmit"
      >
        Submit
      </button>
    </div>
  </div>
`;te();var yr="custom-edit-request-form",bi=class extends ze{constructor({entity:e}){super({entity:e}),this.init()}init(){}async clickSubmit(){this.saving(!0),await this.submit(),this.saving(!1)}async submit(){if(this.validate().length)return;let s=this.entity;try{await Ko(s),this.onComplete(SP.UI.DialogResult.OK)}catch(n){alert(n)}}fieldIsEditable(e){let s=this.entity;return![s.ReqNum,s.EmailSent].includes(e)}params=this;componentName=yr};he(yr,{template:Rr});te();te();var wr=ce`
  <div class="audit-form bg-dark">
    <div class="form-fields" data-bind="foreach: FormFields">
      <!-- ko if: $parent.fieldIsEditable($data) -->
      <div
        class="form-field-component"
        data-bind="component: {
                name: components.edit, params: $data}, 
                class: width"
      ></div>
      <!-- /ko -->
      <!-- ko ifnot: $parent.fieldIsEditable($data) -->
      <div
        class="form-field-component"
        data-bind="component: {
                  name: components.view, params: $data}, 
                  class: width"
      ></div>
      <!-- /ko -->
    </div>
    <div class="form-actions">
      <!-- <button type="button" class="btn btn-warn" data-bind="click: clearForm">
        Clear Form
      </button> -->
      <button
        type="button"
        class="btn btn-success"
        data-bind="click: clickSubmit"
      >
        Submit
      </button>
    </div>
  </div>
`;var Cr="custom-edit-coversheet-form",Ri=class extends ze{constructor({entity:e}){super({entity:e})}async clickSubmit(){this.saving(!0),await this.submit(),this.saving(!1)}async submit(){if(this.validate().length)return;let s=this.entity;try{await Ho(s),this.onComplete(SP.UI.DialogResult.OK)}catch(n){alert(n)}}fieldIsEditable(e){let s=this.entity;return![s.ReqNum,s.FileRef].includes(e)}params=this;componentName=Cr};he(Cr,{template:wr});ei();Ge();te();te();var Sr=ce`
  <div class="audit-form bg-dark new-request-form">
    <div class="form-fields" data-bind="foreach: FormFields">
      <!-- ko if: $parent.fieldIsEditable($data) -->
      <div
        class="form-field-component"
        data-bind="component: {
              name: components.edit, params: $data}, 
              class: classList"
      ></div>
      <!-- /ko -->
      <!-- ko ifnot: $parent.fieldIsEditable($data) -->
      <div
        class="form-field-component"
        data-bind="component: {
                name: components.view, params: $data}, 
                class: classList"
      ></div>
      <!-- /ko -->
    </div>
    <div class="form-actions">
      <button type="button" class="btn btn-warn" data-bind="click: clearForm">
        Clear Form
      </button>
      <button
        type="button"
        class="btn btn-success"
        data-bind="click: clickSubmit"
      >
        Create Response
      </button>
    </div>
  </div>
`;var Ar="custome-new-response-form",yi=class extends ze{constructor({entity:e}){super({entity:e,view:Ke.Views.NewForm})}async clickSubmit(){this.saving(!0),await this.submit(),this.saving(!1)}async submit(){if(this.validate().length)return;let s=ko.unwrap(this.entity);try{await Jo(s.ReqNum.Value(),s),this.onComplete(SP.UI.DialogResult.OK)}catch(n){alert(n)}}clearForm(){}fieldIsEditable(e){return![ko.unwrap(this.entity).ReqNum].includes(e)}componentName=Ar};he(Ar,{template:Sr});Ge();te();te();var Dr=ce`
  <div class="audit-form bg-dark">
    <div class="form-fields" data-bind="foreach: FormFields">
      <!-- ko if: $parent.fieldIsEditable($data) -->
      <div
        class="form-field-component"
        data-bind="component: {
                name: components.edit, params: $data}, 
                class: classList"
      ></div>
      <!-- /ko -->
      <!-- ko ifnot: $parent.fieldIsEditable($data) -->
      <div
        class="form-field-component"
        data-bind="component: {
                  name: components.view, params: $data}, 
                  class: classList"
      ></div>
      <!-- /ko -->
    </div>
    <div class="form-actions">
      <button
        type="button"
        class="btn btn-success"
        data-bind="click: clickSubmit"
      >
        Submit
      </button>
    </div>
  </div>
`;var kr="custome-edit-response-form",wi=class extends ze{constructor({entity:e}){super({entity:e,view:Ke.Views.EditForm}),this.currentResponseStatus=e.ResStatus.Value(),e.ResStatus.Value.subscribe(this.onStatusChangedHandler,this)}onStatusChangedHandler=async e=>{if(e!=this.currentResponseStatus&&e==Re.Closed){let s=ko.unwrap(this.entity),n=await Zs();s.ClosedBy.Value(n),s.ClosedDate.Value(new Date)}};async clickSubmit(){this.saving(!0),await this.submit(),this.saving(!1)}async submit(){if(this.validate().length)return;let s=ko.unwrap(this.entity);try{await Zo(s.ReqNum.Value(),s),this.onComplete(SP.UI.DialogResult.OK)}catch(n){alert(n)}}fieldIsEditable(e){let s=ko.unwrap(this.entity);return![s.ReqNum,s.Title,s.SampleNumber].includes(e)}componentName=kr};he(kr,{template:Dr});te();Ge();te();var _r=ce`
  <div class="audit-form bg-dark">
    <!-- ko foreach: StatusErrors -->
    <div class="alert alert-warning" data-bind="text: $data"></div>
    <!-- /ko -->
    <div class="form-fields" data-bind="foreach: FormFields">
      <!-- ko if: $parent.fieldIsEditable($data) -->
      <div
        class="form-field-component"
        data-bind="component: {
                name: components.edit, params: $data}, 
                class: width"
      ></div>
      <!-- /ko -->
      <!-- ko ifnot: $parent.fieldIsEditable($data) -->
      <div
        class="form-field-component"
        data-bind="component: {
                  name: components.view, params: $data}, 
                  class: width"
      ></div>
      <!-- /ko -->
    </div>
    <div class="form-actions">
      <button
        type="button"
        class="btn btn-success"
        data-bind="click: clickSubmit, disable: StatusErrors().length"
      >
        Submit
      </button>
    </div>
  </div>
`;var Tr="custome-edit-responsedoc-form",Ci=class extends ze{constructor({entity:e}){super({entity:e,view:Ct.Views.EditForm}),this.currentResponseDocStatus=e.DocumentStatus.Value(),e.DocumentStatus.Value.subscribe(this.onStatusChangedHandler,this)}onStatusChangedHandler=e=>{e!=this.currentResponseDocStatus};async clickSubmit(){this.saving(!0),await this.submit(),this.saving(!1)}async submit(){if(this.validate().length)return;let s=ko.unwrap(this.entity),n=s.ReqNum.Value(),o=s.ResID.Value();try{await tr(n,o,s),this.onComplete(SP.UI.DialogResult.OK)}catch(r){alert(r)}}fieldIsEditable(e){let s=ko.unwrap(this.entity);return![s.ReqNum,s.ResID,s.FileName].includes(e)}StatusErrors=ko.pureComputed(()=>{let e=[],s=ko.unwrap(this.entity);if(!s)return e;let n=s.ReqNum.Value()?.ReqStatus.Value(),o=s.ResID.Value()?.ResStatus.Value();return n!=nt.OPEN&&n!=nt.REOPENED&&e.push("The Request associated to this Document is not Open. It can only be re-opened from the IA Dashboard"),o==Re.Closed&&e.push("The Response associated to this Document is Closed. It can only be re-opened from the IA Dashboard"),e});componentName=Tr};he(Tr,{template:_r});_t();Ge();te();Be();te();te();var Ir=ce`
  <div id="bulkAddRequest" class="audit">
    <button
      class="btn btn-warn"
      type="button"
      data-bind="click: clickUploadResponses"
    >
      Add/Modify Requests
    </button>
    <div id="divBulkRequests" data-bind="if: bulkRequestItems">
      <table id="tblBulkRequests" class="tablesorter report">
        <thead>
          <tr>
            <th>Request Number</th>
            <th>Request Subject</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody data-bind="foreach: bulkRequestItems">
          <tr class="bulk-request-item" data-bind="class: status">
            <td data-bind="text: bulkRequest.Title"></td>
            <td data-bind="text: bulkRequest.FieldMap.ReqSubject.toString"></td>
            <td data-bind="text: message"></td>
          </tr>
        </tbody>
        <tfoot class="footer">
          <tr>
            <th colspan="3">
              Total: <span data-bind="text: bulkRequestItems().length"></span>
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="">
      <button
        class="btn btn-success"
        type="button"
        data-bind="click: clickSubmitRequests, enable: bulkRequestItems().length"
        title="Click here to Create the Responses"
      >
        Create Requests
      </button>
    </div>
  </div>

  <style>
    #bulkAddRequest button {
      margin-bottom: 10px;
    }
    div#divBulkRequests {
      margin: 10px;
    }

    tr.bulk-request-item {
    }

    tr.bulk-request-item.pending td {
      color: white !important;
    }
    tr.bulk-request-item.pending {
      color: white !important;
      background-color: var(--warn-color);
    }

    tr.bulk-request-item.succeeded td {
      color: white !important;
    }
    tr.bulk-request-item.succeeded {
      color: white !important;
      background-color: var(--success-color);
    }

    tr.bulk-request-item.failed td {
      color: white !important;
    }
    tr.bulk-request-item.failed {
      color: white !important;
      background-color: var(--danger-color);
    }
  </style>
`;var Pr="bulk-add-request-form",Si=class{constructor(){}bulkRequestItems=ko.observableArray();working=ko.observable(!1);async Init(){this.fetchBulkRequests()}async clickUploadResponses(){li(!1),await T.AuditBulkRequests.ShowForm("BulkAddRequest.aspx","Bulk Add Requests",{}),li(!0),this.fetchBulkRequests()}async fetchBulkRequests(){console.log("Request added callback");let e=await T.AuditBulkRequests.ToList(!0);this.bulkRequestItems(e.map(s=>({bulkRequest:s,status:ko.observable(""),message:ko.observable("")})))}async clickSubmitRequests(){this.working(!0);let e=this.bulkRequestItems(),s=[],n=e.map(async r=>{r.status("pending");let a=r.bulkRequest,l=a.toRequest();l.Reminders.Value(l.Reminders.Options());try{await mi(l),await Xo(l)}catch(u){s.push([u,a]),r.status("failed"),r.message(u.message);return}r.status("succeeded"),await T.AuditBulkRequests.RemoveEntity(a)}),o=await Promise.all(n);this.working(!1)}componentName=Pr;params=this};he(Pr,{template:Ir});document.getElementById("app").innerHTML=kn;window.Audit=window.Audit||{};Audit.IAReport=Audit.IAReport||{};var en="ReqNum";async function xr(){await Kn();let t=T.AuditConfigurations.ToList().then(s=>{s.map(n=>ws[n.key]=n.value)}),e=T.AuditOrganizations.ToList().then(s=>{ko.utils.arrayPushAll(Ve,s.sort(Bs))});await Promise.all([t,e]),Wi(),Audit.IAReport.Report=new Audit.IAReport.NewReportPage,Audit.IAReport.Init()}Audit.IAReport.Init=function(){function t(){var e=setInterval(function(){var s=$("#divCounter").text(),n=s*1-1;$("#divCounter").text(n),n<=0&&(Audit.IAReport.Report.IsTransactionExecuting()?(clearInterval(e),$("#divCounter").text("1200"),t()):Audit.IAReport.Report.Refresh())},1e3)}t()};Audit.IAReport.NewReportPage=function(){j=new rl,ko.applyBindings(j),al();var t={Load:mn,ViewPermissions:yl,ViewLateRequests:Rl,ViewResponseDocsToday:wl,ViewReturnedDocs:Cl,GoToRequest:function(e,s){Jr(e,s)},IsTransactionExecuting:function(){return fe},Refresh:ve,CreateInternalRequestItem:Xr};return t};var il=null,nl=null,Ur=null,tn=null,sn=null,nn=null,Se={};function ki(){return Object.entries(Se).filter(([t,e])=>t.startsWith("request-")).map(([t,e])=>e)}var St=new Array,Fs=new Array,qr=null,Er=null,Ns=null,_e=null,Di=null,un=null,fe=!1;var Rt=null,ue=!0,et=null,qs=new Object,dn=new Object,ol="1-Open";var j=null;function rl(){var t=this;t.refresh=()=>window.location.reload(),t.debugMode=ko.observable(!1),t.siteUrl=Audit.Common.Utilities.GetSiteUrl(),t.showQuickInfo=ko.observable(!1),t.arrRequests=ko.observableArray(null),t.arrResponses=ko.observableArray(null),t.cntPendingReview=ko.observable(0),t.arrRequestsThatNeedClosing=ko.observableArray(null),t.arrResponseDocsCheckedOut=ko.observableArray(null),t.arrResponsesWithUnsubmittedResponseDocs=ko.observableArray(),t.arrRequestsInternalAlmostDue=ko.observableArray(null),t.arrRequestsInternalPastDue=ko.observableArray(null),t.arrRequestsAlmostDue=ko.observableArray(null),t.arrRequestsPastDue=ko.observableArray(null),t.arrRequestsWithNoResponses=ko.observableArray(null),t.arrRequestsWithNoEmailSent=ko.observableArray(null),t.arrResponsesSubmittedByAO=ko.observableArray(null),t.arrResponsesReadyToClose=ko.observableArray(),t.alertQuickInfo=ko.pureComputed(()=>t.arrRequestsThatNeedClosing().length||t.arrResponseDocsCheckedOut().length||t.arrResponsesWithUnsubmittedResponseDocs().length||t.arrRequestsInternalAlmostDue().length||t.arrRequestsInternalPastDue().length||t.arrRequestsAlmostDue().length||t.arrRequestsPastDue().length||t.arrRequestsWithNoResponses().length||t.arrRequestsWithNoEmailSent().length||t.arrResponsesSubmittedByAO().length||t.arrResponsesReadyToClose().length),t.clickExpandActionOffices=(n,o)=>{o.target.parentElement.querySelector(".sr1-request-actionOffice-items").classList.toggle("collapsed")},t.ddOptionsRequestInfoTabRequestName=ko.pureComputed(()=>t.arrRequests().map(n=>n.reqNumber).sort()),t.filterRequestInfoTabRequestName=ko.observableArray(),t.currentRequest=ko.observable(),t.arrCurrentRequestRequestDocs=ko.observableArray(null),t.arrCurrentRequestCoverSheets=ko.observableArray(null),t.bDisplayClose=ko.observable(!1),t.showUpload=ko.observable(!1),t.showSubmit=ko.observable(!1),t.currentDialogs=ai,t.tabOpts={Requests:new bt("request-report","Request Status Report",{id:"requestStatusReportTemplate",data:t}),Responses:new bt("response-report","Response Status Report",{id:"responseStatusReportTemplate",data:t}),RequestDetail:new bt("request-detail","Request Information",{id:"requestDetailTemplate",data:t})},t.tabs=new rs(Object.values(t.tabOpts)),t.runningTasks=Is,t.blockingTasks=Bo,t.ClickNewRequest=()=>{Sl()},t.ClickResetPerms=()=>{Mo()},t.ClickBulkAddRequest=()=>{Al()},t.ClickGoToRequest=function(n){n&&n.number&&Jr(n.number)},t.ClickViewRequest=function(){var n=t.currentRequest();n&&n.ID&&Dl(n.ID)},t.ClickEditRequest=function(){var n=t.currentRequest();n&&n.number&&kl(n.ID,n.number)},t.ClickViewRequestDoc=function(n){n&&n.ID&&m_fnViewRequestDoc(n.ID)},t.ClickEditRequestDoc=function(n){var o=t.currentRequest();n&&n.ID&&o&&o.number&&m_fnEditRequestDoc(n.ID,o.number)},t.ClickViewCoversheet=function(n){n&&n.ID&&_l(n.ID)},t.ClickEditCoversheet=function(n){var o=t.currentRequest();n&&n.ID&&o&&o.number&&Tl(n.ID,o.number)},t.ClickCloseRequest=function(){$l()},t.ClickGrantSpecialPermissions=function(){var n=t.currentRequest();n&&n.number&&zl(n.number)},t.ClickRemoveSpecialPermissions=function(){var n=t.currentRequest();n&&n.number&&Jl(n.number)},t.ClickUploadRequestDoc=function(){var n=t.currentRequest();n&&n.number&&m_fnUploadRequestDoc(n.number)},t.ClickSendEmail=function(){var n=t.currentRequest();n&&n.ID&&Wl(n.ID)},t.ClickViewEmailHistoryFolder=function(){var n=t.currentRequest();n&&n.number&&Bl(n.number)},t.ClickSyncEmailActionOffices=function(){var n=t.currentRequest();n&&n.ID&&jl(n.ID)},t.ClickViewResponse=function(n){var o=t.currentRequest();o&&o.number&&n&&El(o.number,n.ID,n.title,n.resStatus)},t.ClickEditResponse=function(n){var o=t.currentRequest();o&&o.number&&n&&Fl(o.number,n.ID,n.title,n.resStatus)},t.ClickReviewingResponse=function(n){var o=t.currentRequest();o&&o.number&&n&&Nl(n.activeViewers)},t.ClickReOpenResponse=function(n){var o=t.currentRequest();o&&o.number&&n&&Ql(o.number,n.title)},t.ClickAddResponse=function(){var n=t.currentRequest();n&&n.number&&ql(n.ID,n.number)},t.ClickBulkAddResponse=function(){var n=t.currentRequest();n&&n.number&&Il(n.number)},t.ClickBulkEditResponse=function(){var n=t.currentRequest();n&&n.number&&Pl(n.number)},t.ClickCheckInResponseDocument=function(n){n&&n.folder&&n.fileName&&Vl(n.folder,n.fileName)},t.ClickViewResponseDocFolder=function(n){n&&n.title&&Gl(n.title)},t.ClickViewResponseDoc=function(n){n&&n.requestID&&n.responseTitle&&Ol(n.ID,n.requestID,n.responseTitle)},t.ClickEditResponseDoc=function(n){n&&n.requestID&&n.responseTitle&&Ul(n.ID,n.requestID,n.responseTitle)},t.ClickDeleteResponseDoc=function(n){n&&n.ID&&Ll(n.ID)},t.ClickResendRejectedResponseDocToQA=function(n){n&&n.ID&&Ml(n.ID)},t.requestDetailViewComponent=new vi(t),t.filterRequestInfoTable=(n,o)=>{document.getElementById("tblStatusReportRequests").filterByColIndex()},t.arrRequests.subscribe(n=>{document.getElementById("tblStatusReportRequests")?.update()},"arrayChange"),t.arrResponses.subscribe(n=>{document.getElementById("tblStatusReportResponses")?.update()},"arrayChange"),t.filterStatusTables=n=>{Audit.Common.Utilities.OnLoadDisplayTimeStamp();var o=GetUrlKeyValue("Tab"),r=GetUrlKeyValue("ReqNum"),a=GetUrlKeyValue("ResNum");o!=null&&o!=""?t.tabs.selectById(o):t.tabs.selectTab(t.tabOpts.Requests),r!=null&&r!=""&&(o==t.tabOpts.Responses.id?document.getElementById("tblStatusReportResponses").filterByColIndex(0,r):t.filterRequestInfoTabRequestName(r)),a!=null&&a!=""&&o==t.tabOpts.Responses.id?document.getElementById("tblStatusReportResponses").filterByColIndex(2,a):document.getElementById("tblStatusReportResponses").filterByColIndex(4,ol)};var e=function(n){return function(o){n.activeViewers.removeCurrentuser()}},s;t.filterRequestInfoTabRequestName.subscribe(function(n){var o=Se["request-"+n];o&&o.activeViewers&&(o.activeViewers.removeCurrentuser(),window.removeEventListener("beforeunload",s))},null,"beforeChange"),t.filterRequestInfoTabRequestName.subscribe(function(n){t.currentRequest(null),t.arrCurrentRequestRequestDocs([]),t.arrCurrentRequestCoverSheets([]),t.bDisplayClose(!1);var o=Se["request-"+n];o&&(o.activeViewers&&(o.activeViewers.pushCurrentUser(),s=e(o),window.addEventListener("beforeunload",s)),Vr(o.ID))}),window.addEventListener("popstate",n=>{n.state&&n.state[en]&&t.filterRequestInfoTabRequestName(n.state[en])}),t.currentRequest.subscribe(n=>{n&&oi(en,n.number)})}function al(){var t=new SP.ClientContext.get_current,e=t.get_web(),s=e.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequests()),n=new SP.CamlQuery;n.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>');let o=s.getItems(n);t.load(o,"Include(ID, Title, ReqType, ReqSubject, ReqStatus, RequestingOffice, FiscalYear, IsSample, ReqDueDate, InternalDueDate, ActionOffice, EmailActionOffice, Reviewer, Owner, ReceiptDate, RelatedAudit, ActionItems, Comments, EmailSent, ClosedDate, ClosedBy, Modified, Sensitivity)");var r=e.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequestsInternal()),a=new SP.CamlQuery;a.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>');let l=r.getItems(a);t.load(l,"Include(ID, Title, ReqNum, InternalStatus, ActiveViewers)");var u=e.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleResponses()),d=new SP.CamlQuery;d.set_viewXml('<View><Query><OrderBy><FieldRef Name="ReqNum"/></OrderBy></Query></View>');let m=u.getItems(d);t.load(m,"Include(ID, Title, ReqNum, ActionOffice, ReturnReason, SampleNumber, ResStatus, ActiveViewers, Comments, Modified, ClosedDate, ClosedBy, POC, POCCC)");var p=e.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs()),g=new SP.CamlQuery;g.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="ReqNum"/><FieldRef Name="ResID"/></OrderBy><Where><Eq><FieldRef Name="ContentType"/><Value Type="Text">Document</Value></Eq></Where></Query></View>');let b=p.getItems(g);t.load(b,"Include(ID, Title, ReqNum, ResID, DocumentStatus, RejectReason, ReceiptDate, FileLeafRef, FileDirRef, File_x0020_Size, CheckoutUser, Modified, Editor, Created)");let h=e.get_siteGroups();t.load(h);var S=e.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleActionOffices()),A=new SP.CamlQuery;A.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>');let w=S.getItems(A);t.load(w,"Include(ID, Title, UserGroup)");var D=new SP.BasePermissions;D.set(SP.PermissionKind.deleteListItems),qr=e.doesUserHavePermissions(D),t.executeQueryAsync(k,G);function k(Q,L){if(ue=qr.get_value(),ue){let ie=function(ye,ae){$("#divIA").show(),on(w,h,o,l,m,b),Qo()},re=function(ye,ae){$("#divIA").show(),on(w,h,o,l,m,b)};var W=new SP.ClientContext.get_current,Y=W.get_web(),N=Y.get_lists().getByTitle("Pages"),V=new SP.CamlQuery;V.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Or><Eq><FieldRef Name="FileLeafRef"/><Value Type="Text">AO_DB.aspx</Value></Eq><Eq><FieldRef Name="FileLeafRef"/><Value Type="Text">RO_DB.aspx</Value></Eq></Or></Where></Query></View>'),Er=N.getItems(V),W.load(Er,"Include(ID, Title, FileLeafRef, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))");var B=Y.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory()),X=new SP.CamlQuery;X.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><And><Eq><FieldRef Name="Title"/><Value Type="Text">EANotifications</Value></Eq><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></And></Where></Query></View>');var U=B.getItems(X);W.load(U,"Include(ID, Title, DisplayName)"),W.executeQueryAsync(ie,re)}else $("#divIA").show(),ue=!1,on(w,h,o,l,m,b);setTimeout(function(){ll()},100)}function G(Q,L){$("#divLoading").hide();let W=SP.UI.Status.addStatus("Request failed: "+L.get_message()+`
`+L.get_stackTrace());SP.UI.Status.setStatusPriColor(W,"red"),ue=!1}}function ve(t){window.location.reload()}function on(t,e,s,n,o,r){Audit.Common.Utilities.LoadSiteGroups(e),Audit.Common.Utilities.LoadActionOffices(t),mn(s,n,o,r)}function mn(t,e,s,n){Gr(t),Br(e),Lr(s),dl(n),cl(),hl(),vl(),bl()}async function Ne(t=null){t||(t=j.currentRequest()?.ID),await Vr(t);return;var e,s,n,o,a,l,d,m,g,b}async function Vr(t=null){let e=pe(me.refresh);var s=new SP.ClientContext.get_current,n=s.get_web(),o=n.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequests()),r=new SP.CamlQuery;r.set_viewXml('<View><Query><Where><Eq><FieldRef Name="ID"/><Value Type="Text">'+t+"</Value></Eq></Where></Query></View>");var a=o.getItems(r);ue?($(".response-permissions").hide(),s.load(a,"Include(ID, Title, ReqType, ReqSubject, RequestingOffice, ReqStatus, FiscalYear, IsSample, ReqDueDate, InternalDueDate, ActionOffice, EmailActionOffice, Reviewer, Owner, ReceiptDate, RelatedAudit, ActionItems, Comments, EmailSent, ClosedDate, ClosedBy, Modified, Sensitivity, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))")):s.load(a,"Include(ID, Title, ReqType, ReqSubject, RequestingOffice, ReqStatus, FiscalYear, IsSample, ReqDueDate, InternalDueDate, ActionOffice, EmailActionOffice, Reviewer, Owner, ReceiptDate, RelatedAudit, ActionItems, Comments, EmailSent, ClosedDate, ClosedBy, Modified, Sensitivity)");var l=n.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequestsInternal()),u=new SP.CamlQuery;u.set_viewXml(`<View><Query><Where><Eq><FieldRef Name="ReqNum" LookupId='TRUE'/><Value Type="Lookup">${t}</Value></Eq></Where><OrderBy><FieldRef Name="Title"/></OrderBy></Query><RowLimit>1</RowLimit></View>`);let d=l.getItems(u);s.load(d,"Include(ID, Title, ReqNum, InternalStatus, ActiveViewers)"),await new Promise((L,W)=>s.executeQueryAsync(L,(Y,N)=>W({sender:Y,args:N}))).catch(({sender:L,args:W})=>{console.error("Unable to requery request: "+t)}),Gr(a),Br(d);let m=pn(t);if(!m){alert("Request was not successfully reloaded!");return}for(var p=a.getEnumerator();p.moveNext();){var g=p.get_current();m.item=g;break}if(ue)if(m.item.get_hasUniqueRoleAssignments()){for(var b=!1,h=0;h<m.actionOffices.length;h++){var S=m.actionOffices[h].ao,A=Audit.Common.Utilities.GetAOSPGroupName(S);if(A!=null&&$.trim(A)!=""){var w=Audit.Common.Utilities.CheckSPItemHasGroupPermission(m.item,A,SP.PermissionKind.viewListItems);if(!w){b=!0;break}}}if(b){let L=SP.UI.ModalDialog.showWaitScreenWithNoClose("Information","Please wait... Updating Request permissions",200,400);await At(m.item,!1),ve();return}}else{let L=SP.UI.ModalDialog.showWaitScreenWithNoClose("Information","Please wait... Updating Request permissions",200,400);await At(m.item,!1),ve();return}var D=!1,k=!1;if(ue){var G=SP.PermissionKind.viewListItems;D=Audit.Common.Utilities.CheckSPItemHasGroupPermission(m.item,Audit.Common.Utilities.GetGroupNameSpecialPerm1(),G),k=Audit.Common.Utilities.CheckSPItemHasGroupPermission(m.item,Audit.Common.Utilities.GetGroupNameSpecialPerm2(),G),D&&k?m.specialPerms=!0:m.specialPerms=!1}if(j.currentRequest(m),j.bDisplayClose(!1),St&&St.length>0)for(var h=0;h<St.length;h++){var Q=St[h];if(Q.number==m.number){j.bDisplayClose(!0);break}}await Promise.all([ml(m),fl(m)]),await gl(m),j.currentRequest.valueHasMutated(),de(e)}function Fr(){var t=GetUrlKeyValue("Sect");t&&document.getElementById(t)?.scrollIntoView(!0)}function ll(){var t=new SP.ClientContext.get_current,e=t.get_web();tn=t.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleCoverSheets()),t.load(tn,"Title","Id"),sn=t.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleRequestDocs()),t.load(sn,"Title","Id"),nn=t.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs()),t.load(nn,"Title","Id");function s(o,r){Ur=nn.get_id(),il=tn.get_id(),nl=sn.get_id()}function n(o,r){let a=SP.UI.Status.addStatus("Failed loading: "+r.get_message()+`
`+r.get_stackTrace());SP.UI.Status.setStatusPriColor(a,"red")}t.executeQueryAsync(s,n)}async function ul(t,e,s){let n=Se["response-"+e];if(n)return await Vs(t,n,!1,!0,!1,!1),!0}function Gr(t){let e=new Array;try{for(var s=t.getEnumerator();s.moveNext();){var n=s.get_current(),o=n.get_item("ID"),r=n.get_item("Title"),a=n.get_item("ReqStatus");let ie=n.get_item("ReqType");var l=n.get_item("ReqSubject");l==null&&(l="");var u=n.get_item("Sensitivity");u==null&&(u="None");var d=n.get_item("RequestingOffice");d!=null?d=d.get_lookupValue():d="";var m=n.get_item("FiscalYear"),p=n.get_item("IsSample"),g=n.get_item("ReqDueDate"),b=n.get_item("InternalDueDate"),h=n.get_item("ReceiptDate"),S=n.get_item("ClosedDate");g!=null?g=g.format("yyyy-MM-dd"):g="",b!=null?b=b.format("yyyy-MM-dd"):b="",h!=null?h=h.format("yyyy-MM-dd"):h="",S!=null?S=S.format("yyyy-MM-dd"):S="";var A=new Array,w=n.get_item("ActionOffice");if(w.length>0){for(var D=new Array,k=0;k<w.length;k++)D.push(w[k].get_lookupValue());D=D.sort();for(var k=0;k<D.length;k++)A.push({ao:D[k]})}var G=new Array,Q=n.get_item("EmailActionOffice");if(Q.length>0){for(var D=new Array,k=0;k<Q.length;k++)D.push(Q[k].get_lookupValue());D=D.sort();for(var k=0;k<D.length;k++)G.push({ao:D[k]})}var L=n.get_item("Comments"),W=n.get_item("EmailSent"),Y=n.get_item("Reviewer"),N=n.get_item("Owner"),V=n.get_item("RelatedAudit"),B=n.get_item("ActionItems");L==null&&(L=""),Y==null&&(Y=""),N==null&&(N=""),V==null&&(V=""),B==null&&(B="");var X=Audit.Common.Utilities.GetFriendlyDisplayName(n,"ClosedBy"),U=Se["request-"+r]??{};U.ID=o,U.reqType=ie,U.number=r,U.subject=l,U.sensitivity=u,U.requestingOffice=d,U.fiscalYear=m,U.dueDate=g,U.status=a,U.internalDueDate=b,U.sample=p,U.requestDocs=new Array,U.coversheets=new Array,U.responses=new Array,U.responsesOpenCnt=0,U.actionOffices=A,U.emailActionOffices=G,U.comments=L,U.emailSent=W,U.closedDate=S,U.closedBy=X,U.reviewer=Y,U.owner=N,U.receiptDate=h,U.relatedAudit=V,U.actionItems=B,U.specialPerms=null,U.item=n,e.push(U),Se["request-"+r]=U}}catch(ie){alert(ie)}return e}function Br(t){try{for(var e=t.getEnumerator();e.moveNext();){var s=e.get_current(),n=s.get_item("ID"),o=s.get_item("ReqNum");if(!o||!o.get_lookupValue()){console.warn("Unaffiliated Internal Status ID:",n);continue}var r=qt(o.get_lookupValue());r&&(r.internalStatus=new Xs(n,{requestListTitle:Audit.Common.Utilities.GetListTitleRequestsInternal(),columnName:"InternalStatus",initialValue:s.get_item("InternalStatus")}),r.activeViewers=new Gi(n,{requestListTitle:Audit.Common.Utilities.GetListTitleRequestsInternal(),columnName:"ActiveViewers",initialValue:s.get_item("ActiveViewers")}))}}catch(a){alert(a)}}function Lr(t){try{for(var e=t.getEnumerator();e.moveNext();){var s=e.get_current(),n=s.get_item("ReqNum");if(n!=null){if(n=n.get_lookupValue(),n==null)continue;var o=Se["request-"+n],r=s.get_item("ReturnReason");r==null&&(r="");var a=s.get_item("Title"),l=Se["response-"+a]??new Object;l.ID=s.get_item("ID"),l.number=n,l.title=a,l.item=s;var u=s.get_item("Comments");try{u=$(u).html(),u==null||u==""?l.comments="":(u=u.replace(/[^a-z0-9\s]/gi," "),l.comments=u)}catch{(u==null||u=="")&&(l.comments=""),u=u.replace(/[^a-z0-9\s]/gi," "),l.comments=u}var d=s.get_item("Modified").format("yyyy-MM-dd hh:mm tt");l.modified=d;var m=s.get_item("ClosedDate");m!=null?m=m.format("yyyy-MM-dd"):m="",l.closedDate=m,l.closedBy=Audit.Common.Utilities.GetFriendlyDisplayName(s,"ClosedBy"),l.sample=s.get_item("SampleNumber"),l.sample==null&&(l.sample=""),l.actionOffice=s.get_item("ActionOffice"),l.actionOffice==null?l.actionOffice="":l.actionOffice=l.actionOffice.get_lookupValue(),l.poc=s.get_item("POC"),l.poc==null?l.poc="":l.poc=l.poc.get_email(),l.pocCC=s.get_item("POCCC"),l.pocCC==null?l.pocCC="":l.pocCC=l.pocCC.get_email(),l.returnReason=r,l.resStatus=s.get_item("ResStatus"),l.resStatus!="7-Closed"&&(o.responsesOpenCnt=o.responsesOpenCnt+1),l.responseDocs=new Array,l.responseFolderItem=null,o.responses.push(l),Se["response-"+a]=l}}}catch(p){alert(p)}}function dl(t){j.arrResponseDocsCheckedOut([]),j.arrResponseDocsCheckedOut.valueHasMutated();var e=new Array;Mr(t,Se);for(var s=t.getEnumerator();s.moveNext();){var n=s.get_current();let a=Audit.Common.Utilities.GetFriendlyDisplayName(n,"CheckoutUser");if(a!=""){var o=n.get_item("ReqNum");o!=null&&(o=o.get_lookupValue());var r=new Object;r.number=o,r.title=n.get_item("Title"),r.checkedOutBy=a,e.push(r)}}ko.utils.arrayPushAll(j.arrResponseDocsCheckedOut(),e),j.arrResponseDocsCheckedOut.valueHasMutated()}function Mr(t,e){try{for(var s=t.getEnumerator();s.moveNext();){var n=s.get_current(),o=n.get_item("ID"),r=n.get_item("ReqNum");r!=null&&(r=r.get_lookupValue());var a=n.get_item("ResID");if(a!=null&&(a=a.get_lookupValue()),r==null||a==null)continue;var l=e["request-"+r];if(!l)continue;let g=l.responses.find(b=>b.title==a);if(g){var u=new Object;u.ID=n.get_item("ID"),u.response=g,u.request=l,u.fileName=n.get_item("FileLeafRef"),u.title=n.get_item("Title"),u.title==null&&(u.title=""),u.folder=n.get_item("FileDirRef"),u.documentStatus=n.get_item("DocumentStatus"),u.rejectReason=n.get_item("RejectReason"),u.rejectReason==null?u.rejectReason="":u.rejectReason=u.rejectReason.replace(/(\r\n|\n|\r)/gm,"<br/>");var d=n.get_item("File_x0020_Size");d=Audit.Common.Utilities.GetFriendlyFileSize(d),u.fileSize=d;var m="";n.get_item("ReceiptDate")!=null&&n.get_item("ReceiptDate")!=""&&(m=n.get_item("ReceiptDate").format("yyyy-MM-dd")),u.receiptDate=m;var p="";n.get_item("Modified")!=null&&n.get_item("Modified")!=""&&(p=n.get_item("Modified").format("yyyy-MM-dd hh:mm tt")),u.modifiedDate=p,u.modifiedBy=Audit.Common.Utilities.GetFriendlyDisplayName(n,"Editor"),u.checkedOutBy=Audit.Common.Utilities.GetFriendlyDisplayName(n,"CheckoutUser"),u.checkedOutBy!="",u.item=n,g.responseDocs.push(u)}}}catch(g){alert(g)}}function cl(){let t=ki();qs=new Object,dn=new Object;for(var e=t.length,s=0;s<e;s++){var n=t[s];if(n.responses.length>0)for(var o=n.responses.length,r=0;r<o;r++){var a=n.responses[r].responseDocs.length;dn[n.responses[r].title]=a;var l=qs[n.number];l==null?qs[n.number]=a:qs[n.number]+=a}}}function Qr(t){Fs=new Array;try{var e=0,s=0;if(t!=null)for(var n=t.getEnumerator();n.moveNext();){var o=n.get_current(),r=o.get_displayName(),a=o.get_id(),l=o.get_item("EncodedAbsUrl");if(o.get_item("Title")==null){let Y=function(V,B){},N=function(V,B){};var u=new SP.ClientContext.get_current,d=u.get_web();o.set_item("Title",r),o.update(),u.executeQueryAsync(Y,N)}var m=new Object;if(m.ID=a,m.ItemName=r,m.Item=o,m.UserPermissions=new Array,m.GroupPermissions=new Array,ue)for(var p=o.get_roleAssignments(),g=p.getEnumerator();g.moveNext();){var b=g.get_current(),h=b.get_member(),S=h.get_loginName(),A=h.get_title(),w="UserPermissions",D=h.get_principalType();(D==SP.Utilities.PrincipalType.securityGroup||D==SP.Utilities.PrincipalType.sharePointGroup)&&(w="GroupPermissions");for(var k=b.get_roleDefinitionBindings(),G=k.getEnumerator();G.moveNext();){var Q=G.get_current(),L=Q.get_name();m[w].push(L+" - "+A)}}Fs.push(m);let W=Se["response-"+r];W&&(W.responseFolderItem=o)}}catch{}}async function ml(t){j.arrCurrentRequestCoverSheets([]),j.arrCurrentRequestCoverSheets.valueHasMutated(),t.coversheets=new Array;var e=new Array,s=new SP.ClientContext.get_current,n=s.get_web(),o=n.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleCoverSheets()),r=new SP.CamlQuery;r.set_viewXml('<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">'+t.number+"</Value></Eq></Where></Query></View>");var a=o.getItems(r);ue?s.load(a,"Include(ID, Title, ReqNum, ActionOffice, FileLeafRef, FileDirRef, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"):s.load(a,"Include(ID, Title, ReqNum, ActionOffice, FileLeafRef, FileDirRef)"),await new Promise((h,S)=>{s.executeQueryAsync(h,S)}).catch(h=>{console.error("Unable to load Coversheets.")});for(var l=a.getEnumerator();l.moveNext();){var u=l.get_current(),d=u.get_item("ReqNum");if(d!=null&&(d=d.get_lookupValue(),d==t.number)){var m=new Object;m.ID=u.get_item("ID"),m.number=d;var p=new Array,g=u.get_item("ActionOffice");if(g&&g.length>0)for(var b=0;b<g.length;b++)p.push({actionOffice:g[b].get_lookupValue()});m.actionOffices=p,m.title=u.get_item("FileLeafRef"),m.folder=u.get_item("FileDirRef"),m.item=u,m.requestStatus=t.status,t.coversheets.push(m)}}ko.utils.arrayPushAll(j.arrCurrentRequestCoverSheets(),t.coversheets),j.arrCurrentRequestCoverSheets.valueHasMutated()}async function pl(t,e){var s=new SP.ClientContext.get_current,n=s.get_web(),o=n.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleResponses()),r=new SP.CamlQuery;r.set_viewXml('<View><Query><Where><Eq><FieldRef Name="Title"/><Value Type="Text">'+t+"</Value></Eq></Where></Query></View>");let a=o.getItems(r);s.load(a,"Include(ID, Title, ReqNum, ActionOffice, ReturnReason, SampleNumber, ResStatus, Comments, Modified, ClosedDate, ClosedBy, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))");var l=s.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs()),u=new SP.CamlQuery;u.set_viewXml('<View><Query><Where><And><Eq><FieldRef Name="Title"/><Value Type="Text">'+t+'</Value></Eq><Eq><FieldRef Name="ContentType" /><Value Type="Text">Folder</Value></Eq></And></Where></Query></View>');let d=l.getItems(u);s.load(d,"Include( DisplayName, Title, Id, EncodedAbsUrl, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"),await new Promise((b,h)=>s.executeQueryAsync(b,h)).catch((b,h)=>!1);for(var m=null,p=a.getEnumerator();p.moveNext();){var g=p.get_current();let b=Se["response-"+t];if(b){b.item=g;break}}return Qr(d),!0}async function fl(t){if(ue&&et!=null&&et!=""&&await pl(et)){let X=await ul(t.status,et)}document.body.style.cursor="wait";var e=SP.UI.Notify.addNotification("Loading Responses...",!0),s=new SP.ClientContext.get_current,n=s.get_web(),o=n.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleResponses()),r=new SP.CamlQuery;r.set_viewXml('<View><Query><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">'+t.number+"</Value></Eq></Where></Query></View>");var a=o.getItems(r);ue?s.load(a,"Include(ID, Title, ReqNum, ActionOffice, ReturnReason, SampleNumber, ResStatus, Comments, ActiveViewers, Modified, ClosedDate, ClosedBy, POC, POCCC, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"):s.load(a,"Include(ID, Title, ReqNum, ActionOffice, ReturnReason, SampleNumber, ResStatus, Comments, ActiveViewers, Modified, ClosedDate, ClosedBy, POC, POCCC)");var l=s.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs()),u=new SP.CamlQuery;u.set_viewXml('<View><Query><Where><And><BeginsWith><FieldRef Name="Title"/><Value Type="Text">'+t.number+'-</Value></BeginsWith><Eq><FieldRef Name="ContentType" /><Value Type="Text">Folder</Value></Eq></And></Where></Query></View>');let d=l.getItems(u);ue?s.load(d,"Include( DisplayName, Title, Id, EncodedAbsUrl, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"):s.load(d,"Include( DisplayName, Title, Id, EncodedAbsUrl)"),await new Promise((B,X)=>s.executeQueryAsync(B,(U,ie)=>X({sender:U,args:ie}))).catch(({sender:B,args:X})=>{let U=SP.UI.Status.addStatus("Request failed: "+X.get_message()+`
`+X.get_stackTrace());SP.UI.Status.setStatusPriColor(U,"red")}),Lr(a);for(var m=a.getEnumerator();m.moveNext();){var p=m.get_current(),g=p.get_item("Title");Se["response-"+g]&&(Se["response-"+g].item=p),ue&&(p.get_hasUniqueRoleAssignments()||_i(p,!1,!0))}Qr(d);var b="",h=t.responses.length;t.responses.sort(function(B,X){return B=parseInt(B.sample,10),X=parseInt(X.sample,10),B-X}),h==0&&(Rt=SP.UI.Notify.addNotification(t.number+" has 0 responses. Please create a Response",!1));for(var S=new Array,A=0;A<h;A++){for(var w=t.responses[A],D="",k=0;k<Fs.length;k++)if(Fs[k].ItemName==w.title){var G=Fs[k].GroupPermissions.sort();G.sort(function(X,U){return X.toLowerCase().localeCompare(U.toLowerCase())});for(var Q=0;Q<G.length;Q++)D+="<div>"+G[Q]+"</div>";break}var L=!1;D.indexOf(Audit.Common.Utilities.GetGroupNameSpecialPerm1())>=0&&D.indexOf(Audit.Common.Utilities.GetGroupNameSpecialPerm2())>=0&&(L=!0);var W=t.item.get_item("ActionOffice"),Y=!1;if(W!=null)for(var k=0;k<W.length;k++)W[k].get_lookupValue()==w.actionOffice&&(Y=!0);var N=new Object,V="";Y||(N={"background-color":"lightsalmon","font-style":"italic","font-weight":"bold",color:"red"},V="This Action Office is not found in the Action Office list for the Request"),w.groupPerms=D,w.specialPerms=L,w.styleTag=N,w.toolTip=V,w.activeViewers=new Gi(w.ID,{requestListTitle:Audit.Common.Utilities.GetListTitleResponses(),columnName:"ActiveViewers",initialValue:w.item.get_item("ActiveViewers")}),S.push(w)}SP.UI.Notify.removeNotification(e),e=null,document.body.style.cursor="default",$r()}function $r(){if(et!=null&&et!=""){let e=function(s){$("[id='response-item-title-"+et+"']").parent().css({"background-color":"inherit","font-weight":"inherit"}),et=null};j.requestDetailViewComponent.highlightResponse(et);return}}async function gl(t){let e=new SP.ClientContext.get_current,s=e.get_web();var n=s.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs()),o=new SP.CamlQuery;o.set_viewXml('<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">'+t.number+'</Value></Eq></Where><OrderBy><FieldRef Name="ReqNum"/><FieldRef Name="ResID"/></OrderBy><Where><Eq><FieldRef Name="ContentType"/><Value Type="Text">Document</Value></Eq></Where></Query></View>');let r=n.getItems(o);e.load(r,"Include(ID, Title, ReqNum, ResID, DocumentStatus, RejectReason, ReceiptDate, FileLeafRef, FileDirRef, File_x0020_Size, CheckoutUser, Modified, Editor, Created)"),await new Promise((p,g)=>e.executeQueryAsync(p,g)),t.responses.map(p=>p.responseDocs=[]),Mr(r,Se),e=new SP.ClientContext.get_current,s=e.get_web();var a=!1;if(t&&t.responses&&t.responses.length>0)for(var l=0;l<t.responses.length;l++){var u=t.responses[l];if(u&&u.responseDocs&&u.responseDocs.length>0)for(var d=0;d<u.responseDocs.length;d++){var m=u.responseDocs[d];m.docIcon=s.mapToIcon(m.fileName,"",SP.Utilities.IconSize.Size16),a=!0}}if(!a){Fr();return}await Gt(e).catch(({sender:p,args:g})=>{let b=SP.UI.Status.addStatus("Request failed: "+g.get_message()+`
`+g.get_stackTrace());SP.UI.Status.setStatusPriColor(b,"red")}),t.responses.sort(Audit.Common.Utilities.SortResponseObjects),Fr()}function hl(){j.arrRequestsThatNeedClosing([]),j.arrRequestsThatNeedClosing.valueHasMutated();let t=ki();if(!(t==null||t.length==0)){St=new Array;for(var e=0;e<t.length;e++){var s=t[e];if(s.status!="Closed"){for(var n=0,o=0;o<s.responses.length;o++)s.responses[o].resStatus=="7-Closed"&&n++;if(s.responses.length>0&&s.responses.length==n){for(var r=null,a=null,l=null,u=null,d="",o=0;o<s.responses.length;o++){var m=s.responses[o].item.get_item("ClosedDate");(r==null||r<m)&&(r=m,a=s.responses[o].closedBy,l=s.responses[o].title,u=s.responses[o],r!=null&&r!=""&&(d=r.format("yyyy-MM-dd hh:mm tt")))}St.push({number:s.number,lastResponseId:l,lastClosedDate:r,lastClosedBy:a,sLastClosedDate:d,oResponse:u})}}}ko.utils.arrayPushAll(j.arrRequestsThatNeedClosing(),St),j.arrRequestsThatNeedClosing.valueHasMutated()}}function vl(){let t=ki();if(j.arrRequests([]),j.arrRequests.valueHasMutated(),j.arrRequestsInternalAlmostDue([]),j.arrRequestsInternalAlmostDue.valueHasMutated(),j.arrRequestsAlmostDue([]),j.arrRequestsAlmostDue.valueHasMutated(),j.arrRequestsInternalPastDue([]),j.arrRequestsInternalPastDue.valueHasMutated(),j.arrRequestsPastDue([]),j.arrRequestsPastDue.valueHasMutated(),j.arrRequestsWithNoResponses([]),j.arrRequestsWithNoResponses.valueHasMutated(),j.arrRequestsWithNoEmailSent([]),j.arrRequestsWithNoEmailSent.valueHasMutated(),t!=null){for(var e=new Array,s=new Array,n=new Array,o=new Array,r=new Array,a=new Array,l=new Array,u=t.length;u--;){var d=t[u],m="",p="";Or(d,d.internalDueDate)?(m="past-due",n.push({title:d.number,number:d.number,internalDueDate:d.internalDueDate,dueDate:d.dueDate})):Nr(d,d.internalDueDate)&&(m="almost-due",s.push({title:d.number,number:d.number,internalDueDate:d.internalDueDate,dueDate:d.dueDate})),Or(d,d.dueDate)?(p="past-due",r.push({title:d.number,number:d.number,internalDueDate:d.internalDueDate,dueDate:d.dueDate})):Nr(d,d.dueDate)&&(p="almost-due",o.push({title:d.number,number:d.number,internalDueDate:d.internalDueDate,dueDate:d.dueDate})),d.responses.length==0&&a.push({title:d.number,number:d.number}),d.emailSent||l.push({title:d.number,number:d.number});var g=qs[d.number];g||(g=0);var b={reqNumber:d.number,subject:d.subject,sensitivity:d.sensitivity,requestingOffice:d.requestingOffice,status:d.status,internalDueDate:d.internalDueDate,dueDate:d.dueDate,internalDueDateStyle:m,dueDateStyle:p,sample:d.sample,sentEmail:d.emailSent,actionOffices:d.actionOffices,emailActionOffices:d.emailActionOffices,responseCount:d.responses.length,responsesOpenCount:d.responsesOpenCnt,responseDocCount:g};e.push(b)}ko.utils.arrayPushAll(j.arrRequests,e),j.arrRequests.valueHasMutated(),ko.utils.arrayPushAll(j.arrRequestsInternalAlmostDue(),s),j.arrRequestsInternalAlmostDue.valueHasMutated(),ko.utils.arrayPushAll(j.arrRequestsAlmostDue(),o),j.arrRequestsAlmostDue.valueHasMutated(),ko.utils.arrayPushAll(j.arrRequestsInternalPastDue(),n),j.arrRequestsInternalPastDue.valueHasMutated(),ko.utils.arrayPushAll(j.arrRequestsPastDue(),r),j.arrRequestsPastDue.valueHasMutated(),ko.utils.arrayPushAll(j.arrRequestsWithNoResponses(),a),j.arrRequestsWithNoResponses.valueHasMutated(),ko.utils.arrayPushAll(j.arrRequestsWithNoEmailSent(),l),j.arrRequestsWithNoEmailSent.valueHasMutated()}}function bl(){let t=ki();if(t==null)return;j.arrResponsesWithUnsubmittedResponseDocs([]);var e=new Array,s=[];let n=[];var o=new Array,r=t.length;function a(w){return w.resStatus==Re.Closed?!1:w.responseDocs.length&&!w.responseDocs.find(D=>[Xe.Open,Xe.Submitted].includes(D.documentStatus))}for(var l=0;l<r;l++)for(var u=t[l],d=u.responses.length,m=0;m<d;m++){var p=u.responses[m],g=p.title,b=p.resStatus,h=dn[p.title];h||(h=0);var S=[];h&&[Re.Open,Re.ReturnedToAO].includes(b)&&(S=p.responseDocs.filter(w=>w.documentStatus==Xe.Open));var A={visibleRow:ko.observable(!0),reqNumber:u.number,sample:p.sample,title:g,internalDueDate:u.internalDueDate,status:b,ao:p.actionOffice,docCount:h,modified:p.modified,request:ko.observable(u)};o.push(A),u.reqType==it.TASKER&&a(p)&&n.push(p),p.resStatus=="2-Submitted"&&e.push({title:p.title,number:u.number}),S.length&&s.push({title:p.title,number:u.number,unsubmittedDocs:S})}o.length>0&&(ko.utils.arrayPushAll(j.arrResponses,o),j.arrResponses.valueHasMutated()),ko.utils.arrayPushAll(j.arrResponsesSubmittedByAO(),e),j.arrResponsesSubmittedByAO.valueHasMutated(),ko.utils.arrayPushAll(j.arrResponsesReadyToClose,n),ko.utils.arrayPushAll(j.arrResponsesWithUnsubmittedResponseDocs,s),j.filterStatusTables(!0),j.showQuickInfo(j.alertQuickInfo())}function Rl(){window.open(Audit.Common.Utilities.GetSiteUrl()+"/pages/AuditReport_RequestsStatus.aspx","_blank")}function yl(){window.open(Audit.Common.Utilities.GetSiteUrl()+"/pages/AuditPermissions.aspx","_blank")}function wl(){window.open(Audit.Common.Utilities.GetSiteUrl()+"/pages/AuditUnSubmittedResponseDocuments.aspx","_blank")}function Cl(){window.open(Audit.Common.Utilities.GetSiteUrl()+"/pages/AuditReturnedResponses.aspx","_blank")}function Nr(t,e){var s=new Date;if(e==null||e=="")return!1;e=new Date(e);var n=1e3*60*60*24,o=Math.ceil((s.getTime()-e.getTime())/n);return(t.status=="Open"||t.status=="ReOpened")&&o>=0&&o<=3}function Or(t,e=null){var s=new Date;if(s.setHours(0,0,0,0),e==null||e=="")return!1;let n=new Date(e);return(t.status=="Open"||t.status=="ReOpened")&&s.getTime()>n.getTime()}function Sl(){if(!ue){SP.UI.Notify.addNotification("You do not have access to perform this action...",!1);return}let e={title:"Create a New Request",form:new pi,dialogReturnValueCallback:eu};Le(e)}function Al(){if(!ue){SP.UI.Notify.addNotification("You do not have access to perform this action...",!1);return}let e={title:"Bulk Add Request",form:new Si,dialogReturnValueCallback:Zl};Le(e)}async function Dl(t){fe=!0;let e=await T.AuditRequests.FindById(t),s=ks(e),n={title:"View Request (ID:"+t+")",form:s,dialogReturnValueCallback:Et};Le(n)}async function kl(t,e){if(!ue){SP.UI.Notify.addNotification("You do not have access to perform this action...",!1);return}fe=!0,Ns=t,_e=e;let s=await T.AuditRequests.FindById(t),n=new bi({entity:s}),o={title:"Edit Request ("+e+")",form:n,dialogReturnValueCallback:ou};Le(o)}async function _l(t){fe=!0;let e=await T.AuditCoversheets.FindById(t),s=ks(e),n={title:"View Coversheet (ID:"+t+")",form:s,dialogReturnValueCallback:Et};Le(n)}async function Tl(t,e){fe=!0,_e=e;let s=await T.AuditCoversheets.FindById(t),o={form:new Ri({entity:s})};o.title="Edit Coversheet (ID:"+t+")",o.dialogReturnValueCallback=ru,Le(o)}function Il(t){if(!ue){SP.UI.Notify.addNotification("You do not have access to perform this action...",!1);return}fe=!0;var e=SP.UI.$create_DialogOptions();e.title="Bulk Add Responses ("+t+")",e.dialogReturnValueCallback=au,e.height=800,e.url=Audit.Common.Utilities.GetSiteUrl()+"/pages/AuditBulkAddResponse.aspx?ReqNum="+t+fn(),SP.UI.ModalDialog.showModalDialog(e)}function Pl(t){if(!ue){SP.UI.Notify.addNotification("You do not have access to perform this action...",!1);return}fe=!0;var e=SP.UI.$create_DialogOptions();e.title="Bulk Edit Responses ("+t+")",e.dialogReturnValueCallback=lu,e.height=850,e.width=1100,e.allowMaximize=!0,e.allowResize=!0,e.args={bigMap:Se,m_fnBreakCoversheetPermissions:Us,m_fnBreakResponsePermissions:_i,m_fnBreakResponseFolderPermissions:jr},e.url=Audit.Common.Utilities.GetSiteUrl()+"/pages/AuditBulkEditResponse.aspx?ReqNum="+t+fn(),SP.UI.ModalDialog.showModalDialog(e)}function xl(t){var e=0;let s=qt(t);for(var n=0;n<s.responses.length;n++)s.responses[n].sample>e&&(e=s.responses[n].sample);return s.responses.length>0&&e++,e}async function ql(t,e){if(!ue){SP.UI.Notify.addNotification("You do not have access to perform this action...",!1);return}fe=!0;var s=xl(e);let n=await T.AuditRequests.FindById(t),o=new Ke;o.ReqNum.Value(n),o.SampleNumber.Value(s);let a={form:new yi({entity:o})};a.title="Add Response to (Request Number:"+t+")",a.dialogReturnValueCallback=uu,Le(a)}async function El(t,e,s,n){fe=!0;let o=await T.AuditResponses.FindById(e);if(!o){SP.UI.Notify.addNotification("Response not found! "+e,!1),alert();return}var a={form:ks(o)};a.title="View Response ("+s+")",a.height=600,a.dialogReturnValueCallback=Et,Le(a)}async function Fl(t,e,s,n){if(!ue){SP.UI.Notify.addNotification("You do not have access to perform this action...",!1);return}fe=!0,_e=t,Ns=e,Di=s,un=n;let o=await T.AuditResponses.FindById(e);if(!o){SP.UI.Notify.addNotification("Response not found! "+e,!1),alert();return}let a={form:new wi({entity:o})};a.title="Edit Response ("+s+")",a.dialogReturnValueCallback=mu,Le(a)}function Nl(t){SP.UI.Notify.addNotification("Reviewing Response...",!1),t.pushCurrentUser()}async function Ol(t,e,s){fe=!0;let n=await T.AuditResponseDocs.FindById(t),r={form:ks(n)};r.title="View Response Doc (ID:"+t+")",r.height="600",r.dialogReturnValueCallback=Et,Le(r)}async function Ul(t,e,s){if(!ue){SP.UI.Notify.addNotification("You do not have access to perform this action...",!1);return}fe=!0;let n=await T.AuditResponseDocs.FindById(t),r={form:new Ci({entity:n})};r.title="Edit ResponseDoc (ID:"+t+")",r.dialogReturnValueCallback=Et,Le(r)}async function ur(t,e){if(!t.sensitivity)return alert("Request Sensitivity has not been set!"),!1;for(let o of t.responses){let r=o.responseDocs.filter(l=>e.includes(l));if(!r.length)continue;for(let l of r){var s=new SP.ClientContext.get_current,n=s.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());let u=Os(l.item,l.responseTitle,t.sensitivity),d=pe(me.approveResponseDoc(u)),m=n.getItemById(l.item.get_item("ID"));s.load(m),await new Promise((p,g)=>{s.executeQueryAsync(p,g)}),m.set_item("DocumentStatus",Xe.SentToQA),m.set_item("RejectReason",""),m.set_item("FileLeafRef",u),m.update(),await new Promise((p,g)=>{s.executeQueryAsync(p,g)}),de(d)}if(o.resStatus!=Re.Submitted)continue;let a=new SP.ClientContext.get_current;a.load(o.item),o.item.set_item("ResStatus",Re.ApprovedForQA),o.item.update(),await Gt(a).catch(({sender:l,args:u})=>{console.error("Unable to set response status approved for QA",o)}),await Vs(t.status,o,!1,!0)}return await At(t.item,!1,Re.ApprovedForQA),t.coversheets?.length&&await Promise.all(t.coversheets.map(o=>Us(o.item,!0))),await Hr(t,e),!0}async function mr(t,e,s){var n=SP.ClientContext.get_current(),a=n.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());let o=a.getItemById(e.ID);n.load(o),await new Promise((N,V)=>n.executeQueryAsync(N,(B,X)=>V({sender:B,args:X}))).catch(({sender:N,args:V})=>{alert("Request failed. "+V.get_message()+`
`+V.get_stackTrace())});var r=new SP.ClientContext.get_current,a=r.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs());o.set_item("DocumentStatus","Rejected"),o.set_item("RejectReason",s);var l="";t&&(l=t.sensitivity);var u=Os(o,e.responseTitle,l);o.set_item("FileLeafRef",u),o.set_item("RejectReason",s),o.update();var d=location.protocol+"//"+location.host+_spPageContextInfo.webServerRelativeUrl+"/";let m=o.get_item("FileDirRef");var p=m.lastIndexOf("/"),g=m.substring(0,p+1),b=m.replace(g,""),h=Audit.Common.Utilities.GetSiteUrl()+"/"+Audit.Common.Utilities.GetLibNameResponseDocs()+"/"+b,S=r.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs()),A=new SP.CamlQuery;A.set_viewXml('<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><And><Eq><FieldRef Name="FSObjType"/><Value Type="Text">0</Value></Eq><Eq><FieldRef Name="FileDirRef"/><Value Type="Text">'+h+"</Value></Eq></And></Where></Query></View>");let w=S.getItems(A);r.load(w);var D=r.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetListTitleResponses()),k=new SP.CamlQuery;k.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="Title"/><Value Type="Text">'+b+"</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>");let G=D.getItems(k);r.load(G);var Q=r.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory()),L=new SP.CamlQuery;L.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>');let W=Q.getItems(L);r.load(W,"Include(ID, FSObjType, Title, DisplayName)"),await new Promise((N,V)=>r.executeQueryAsync(N,(B,X)=>V({sender:B,args:X}))).catch(({sender:N,args:V})=>{alert("Request failed. "+V.get_message()+`
`+V.get_stackTrace())});let Y=SP.UI.Notify.addNotification("Rejected Response Document",!1)}function Vl(t,e){if(!ue){SP.UI.Notify.addNotification("You do not have access to perform this action...",!1);return}fe=!0;var s=SP.UI.$create_DialogOptions();s.title="Check in Response Document",s.height="600",s.dialogReturnValueCallback=Et,s.url=Audit.Common.Utilities.GetSiteUrl()+"/_layouts/checkin.aspx?List={"+Ur+"}&FileName="+t+"/"+e,SP.UI.ModalDialog.showModalDialog(s)}function Gl(t){fe=!0;var e=SP.UI.$create_DialogOptions();e.title="View Response Folder",e.height="600",e.dialogReturnValueCallback=Et,e.url=Audit.Common.Utilities.GetSiteUrl()+"/pages/AuditResponseDocs.aspx?RootFolder="+Audit.Common.Utilities.GetSiteUrl()+"/"+Audit.Common.Utilities.GetLibNameResponseDocs()+"/"+t,SP.UI.ModalDialog.showModalDialog(e)}function Bl(t){fe=!0;var e=SP.UI.$create_DialogOptions();e.title="View Email History",e.autoSize=!0,e.dialogReturnValueCallback=Et,e.url=Audit.Common.Utilities.GetSiteUrl()+"/pages/AuditEmailHistory.aspx?RootFolder="+Audit.Common.Utilities.GetSiteUrl()+"/Lists/"+Audit.Common.Utilities.GetListNameEmailHistory()+"/"+t+fn(),SP.UI.ModalDialog.showModalDialog(e)}function Ll(t){if(!ue){SP.UI.Notify.addNotification("You do not have access to perform this action...",!1);return}if(confirm("Are you sure you would like to Delete this Response Document?")){let o=function(a,l){ve()},r=function(a,l){let u=SP.UI.Status.addStatus("Request failed: "+l.get_message()+`
`+l.get_stackTrace());SP.UI.Status.setStatusPriColor(u,"red")};fe=!0;var e=new SP.ClientContext,s=e.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibNameResponseDocs()),n=s.getItemById(t);n.recycle(),e.executeQueryAsync(o,r)}}function Ml(t){if(!ue){SP.UI.Notify.addNotification("You do not have access to perform this action...",!1);return}if(confirm("Are you sure you would like to Update the Response Document status by clearing the Rejected status marked by QA?")){let o=function(a,l){Ne()},r=function(a,l){let u=SP.UI.Status.addStatus("Request failed: "+l.get_message()+`
`+l.get_stackTrace());SP.UI.Status.setStatusPriColor(u,"red")};fe=!0;var e=new SP.ClientContext,s=e.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibNameResponseDocs()),n=s.getItemById(t);n.set_item("DocumentStatus","Submitted"),n.set_item("RejectReason",""),n.update(),e.executeQueryAsync(o,r)}}async function Ql(t,e){if(!ue){SP.UI.Notify.addNotification("You do not have access to perform this action...",!1);return}if(confirm("Are you sure you would like to re-open this response ("+e+")?")){fe=!0,document.body.style.cursor="wait";var s=new SP.ClientContext.get_current,n=Se["request-"+t];if(n){for(var o=0;o<n.responses.length;o++)if(n.responses[o].title==e){n.responses[o].item.set_item("ResStatus","1-Open"),n.responses[o].item.update(),await Vs("ReOpened",n.responses[o],!1,!0,!1,!1);break}var r=n.item,a=r.get_item("ReqStatus");a=="Closed"?(r.set_item("ReqStatus","ReOpened"),r.update()):a!="Open"&&(r.set_item("ReqStatus","Open"),r.update()),await At(r,!1)}s.executeQueryAsync(function(){setTimeout(function(){ve()},1e3)},function(l,u){alert("Request failed: "+u.get_message()+`
`+u.get_stackTrace()),setTimeout(function(){ve()},1e3)})}}async function $l(){if(!ue){SP.UI.Notify.addNotification("You do not have access to perform this action...",!1);return}var t=$("#ddlReqNum").val();if(confirm("Are you sure you would like to Close this Request ("+t+")?")){fe=!0;for(var e=0;e<St.length;e++){var s=St[e],n=s.number;if(t!=n)continue;var o=s.lastClosedDate,r=s.lastClosedBy,a=qt(n);a.item.set_item("ClosedDate",s.oResponse.item.get_item("ClosedDate")),a.item.set_item("ClosedBy",s.oResponse.item.get_item("ClosedBy")),a.item.set_item("ReqStatus","Closed"),a.item.update();let u=SP.UI.ModalDialog.showWaitScreenWithNoClose("Information","Please wait... updating permissions on the Request",100,600);At(a.item,!1);var l=!1;await zr("Closed",t,!0),setTimeout(function(){ve()},100);break}}}function qt(t){var e=null;return e=Se["request-"+t],e}function pn(t){let e=Object.entries(Se).find(([s,n])=>s.startsWith("request-")&&n.ID==t);if(e)return e[1]}function Hl(t,e,s){var n="<div>Audit Request Reference: <b>{REQUEST_NUMBER}</b></div><div>Audit Request Subject: <b>{REQUEST_SUBJECT}</b></div><div>Audit Request Due Date: <b>{REQUEST_DUEDATE}</b></div>{POC}{REQUEST_RELATEDAUDIT}<br/><div>Below are the listed action items that have been requested for the Audit: </div><div>{REQUEST_ACTIONITEMS}<br/></div><div>Please provide responses for the following Sample(s): </div><br/><div>{RESPONSE_TITLES}</div>";if(n=n.replace("{REQUEST_NUMBER}",t.number),n=n.replace("{REQUEST_SUBJECT}",t.subject),n=n.replace("{REQUEST_DUEDATE}",t.internalDueDate),n=n.replace("{REQUEST_ACTIONITEMS}",t.actionItems),s==null||s==""?n=n.replace("{POC}","<br/>"):n=n.replace("{POC}","<br/><b>POC: "+s+"</b><br/>"),e!=null&&e.length>0){let a=function(l,u){return l=parseInt(l.sample,10),u=parseInt(u.sample,10),l-u};e.sort(a);for(var o="<ul>",r=0;r<e.length;r++)o+="<li>"+e[r].title+"</li>";o+="</ul>",n=n.replace("{RESPONSE_TITLES}",o)}else n=n.replace("{RESPONSE_TITLES}","");return t.relatedAudit==null||t.relatedAudit==""?n=n.replace("{REQUEST_RELATEDAUDIT}","<div>This is a new request, not similar to previous audit cycles.</div>"):n=n.replace("{REQUEST_RELATEDAUDIT}","<div>This request is similar to this previous cycle audit: "+t.relatedAudit+"</div>"),n}function jl(t){if(!ue){SP.UI.Notify.addNotification("You do not have access to perform this action...",!1);return}if(confirm("Are you sure you would like to replace all Email Action Offices with current Action Offices?")){fe=!0;var e=new SP.ClientContext.get_current,s=e.get_web();let r=pn(t);if(r==null){alert("Error occurred");return}if(r.status!="Open"&&r.status!="ReOpened"){SP.UI.Notify.addNotification("This request is not Open.",!1);return}var n=r.item.get_item("ActionOffice"),o=s.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequests());let a=o.getItemById(t);a.set_item("EmailActionOffice",n),a.update(),e.executeQueryAsync(function(){SP.UI.Notify.addNotification("Email Action Offices Set. ",!1),setTimeout(function(){Ne()},1e3)},function(l,u){alert("Request failed: "+u.get_message()+`
`+u.get_stackTrace()),ve()})}}function Wl(t){if(!ue){SP.UI.Notify.addNotification("You do not have access to perform this action...",!1);return}if(!confirm("Are you sure you would like to notify all Action Offices listed in the Email Action Offices field?"))return;fe=!0;var e=new SP.ClientContext.get_current,s=e.get_web();let n=pn(t);if(n==null){alert("Error occurred");return}if(n.status!="Open"&&n.status!="ReOpened"){SP.UI.Notify.addNotification("This request is not Open.",!1);return}var o=n.responses.length;if(o==0){SP.UI.Notify.addNotification("There are no responses associated with this request.",!1);return}var r=n.item.get_item("EmailActionOffice")?.map(W=>W.get_lookupValue());if(r.length==0){SP.UI.Notify.addNotification("Unable to send an email. 0 Action Offices listed in the Email Action Office field",!1);return}for(var a=new Array,l=0;l<o;l++){var u=n.responses[l];if(u.resStatus!="1-Open"&&u.resStatus!="3-Returned to Action Office"){SP.UI.Notify.addNotification("Skipping Response ("+u.title+"). It's not Open or Returned to Action Office",!1);continue}var d=Audit.Common.Utilities.GetAOSPGroupName(u.actionOffice),m=Audit.Common.Utilities.GetSPSiteGroup(d);if(d==""||d==null||m==null){SP.UI.Notify.addNotification("Unable to send an email. Action Office ("+u.actionOffice+") does not have a group associated with it",!1);return}if(r.includes(u.actionOffice)){var p=d;u.poc!=null&&u.poc!=""&&(p=u.poc+";"+u.pocCC);for(var g=u.poc?u.poc+";"+u.pocCC:u.actionOffice,b=!1,h=0;h<a.length;h++)if(a[h].actionOffice==p){var S=new Object;S.sample=u.sample,S.title=u.title,a[h].responseTitles.push(S),b=!0}if(!b){var A=new Object;A.actionOffice=p,A.emailTo=g,A.poc=u.poc,A.responseTitles=new Array;var S=new Object;S.sample=u.sample,S.title=u.title,A.responseTitles.push(S),a.push(A)}}}if(a.length==0){SP.UI.Notify.addNotification("Unable to send an email. 0 Action Offices in the Email Action Office field match the Responses",!1);return}let w=SP.UI.ModalDialog.showWaitScreenWithNoClose("Sending Emails","Please wait... sending email notifications to Action Offices",100,400);document.body.style.cursor="wait";var D=s.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory()),k=new SP.CamlQuery;k.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>');let G=D.getItems(k);e.load(G,"Include(ID, Title, DisplayName)");function Q(W,Y){let N=a.length;for(var V=0,B=0;B<N;B++){var X="Your Response Has Been Requested for Request Number: "+n.number,U=Hl(n,a[B].responseTitles,a[B].poc),ie=new SP.ListItemCreationInformation;ie.set_folderUrl(location.protocol+"//"+location.host+Audit.Common.Utilities.GetSiteUrl()+"/Lists/"+Audit.Common.Utilities.GetListNameEmailHistory()+"/"+n.number);let re=D.addItem(ie);re.set_item("Title",X),re.set_item("Body",U),re.set_item("To",a[B].emailTo),re.set_item("ReqNum",n.number),re.set_item("NotificationType","AO Notification"),re.update(),e.executeQueryAsync(function(){if(V++,V==N){document.body.style.cursor="default";var ye=s.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequests());let ae=ye.getItemById(t);ae.set_item("EmailSent",1),ae.update(),e.executeQueryAsync(function(){SP.UI.Notify.addNotification("Email Sent to Action Offices. ",!1),setTimeout(function(){w.close(),Ne()},1e3)},function(lt,oe){alert("Request failed: "+oe.get_message()+`
`+oe.get_stackTrace()),ve()})}},function(ye,ae){document.body.style.cursor="default",alert("Request failed: "+ae.get_message()+`
`+ae.get_stackTrace()),ve()})}}function L(W,Y){document.body.style.cursor="default",alert("Request failed. "+Y.get_message()+`
`+Y.get_stackTrace())}e.executeQueryAsync(Q,L)}async function Hr(t,e){var s=new SP.ClientContext.get_current,n=s.get_web(),o=n.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());let r=t.number,a="Your Approval Has Been Requested for Request Number: "+r;var l="<div>Audit Request Reference: <b>"+r+"</b></div><div>Audit Request Subject: <b>"+t.subject+"</b></div><div>Audit Request Due Date: <b>"+t.internalDueDate+"</b></div><br/><div>Response(s): <ul>";l+=t.responses.map(m=>{let p=m.responseDocs.filter(g=>e.includes(g));if(p.length)return`<li><b>${m.title}:</b> ${p.length} document(s)</li>`}).join(""),l+="</ul></div><br/>";var u=new SP.ListItemCreationInformation;u.set_folderUrl(location.protocol+"//"+location.host+Audit.Common.Utilities.GetSiteUrl()+"/Lists/"+Audit.Common.Utilities.GetListNameEmailHistory()+"/"+r);let d=o.addItem(u);return d.set_item("Title",a),d.set_item("Body",l),d.set_item("To",Audit.Common.Utilities.GetGroupNameQA()),d.set_item("NotificationType","QA Notification"),d.set_item("ReqNum",r),d.update(),new Promise((m,p)=>{s.executeQueryAsync(m,p)})}async function Kl(t,e,s,n){let o=0;var r=new SP.ClientContext.get_current,a=r.get_web(),l=a.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs()),u=new SP.CamlQuery;u.set_viewXml('<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name="ReqNum"/><Value Type="Text">'+t+'</Value></Eq><Eq><FieldRef Name="ContentType"/><Value Type="Text">Document</Value></Eq></And></Where></Query></View>');let d=l.getItems(u);r.load(d,"Include(ID, ReqNum, ResID, DocumentStatus, FileLeafRef, Created )");var m=a.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocsEA()),p=new SP.CamlQuery;p.set_viewXml('<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name="RequestNumber"/><Value Type="Text">'+t+'</Value></Eq><Eq><FieldRef Name="ContentType"/><Value Type="Text">Document</Value></Eq></And></Where></Query></View>');let g=m.getItems(p);r.load(g,"Include(ID, RequestNumber, ResponseID, FileLeafRef)");var b=a.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleRequestDocs()),h=new SP.CamlQuery;h.set_viewXml('<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">'+t+"</Value></Eq></Where></Query></View>");let S=b.getItems(h);r.load(S,"Include(ID, Title, ReqNum, FileLeafRef, FileDirRef)");var A=a.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleCoverSheets()),w=new SP.CamlQuery;w.set_viewXml('<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">'+t+"</Value></Eq></Where></Query></View>");let D=A.getItems(w);r.load(D,"Include(ID, Title, ReqNum, ActionOffice, FileLeafRef, FileDirRef)"),await new Promise((lt,oe)=>r.executeQueryAsync(lt,oe)).catch((lt,oe)=>{let Ae=SP.UI.Status.addStatus("Request failed: "+oe.get_message()+`
`+oe.get_stackTrace());SP.UI.Status.setStatusPriColor(Ae,"red")});for(var L=d.getEnumerator();L.moveNext();){var k=L.get_current(),G=k.get_item("DocumentStatus");G!="Open"&&G!="Submitted"&&o++}if(o+=g.get_count(),o+=S.get_count(),o+=D.get_count(),o==0)return!0;let Q=[];for(var L=d.getEnumerator();L.moveNext();){var k=L.get_current(),G=k.get_item("DocumentStatus");if(G!="Open"&&G!="Submitted"){var W=k.get_item("ResID");W&&(W=W.get_lookupValue());var Y=k.get_item("FileLeafRef"),N=Os(k,W,e);k.set_item("FileLeafRef",N),k.update(),Q.push(new Promise((Ae,be)=>{r.executeQueryAsync(Ae,be)}).catch((Ae,be)=>{alert("Error occurred updating sensitivity title on Response document: "+Y+" to "+N+" "+be.get_message()+`
`+be.get_stackTrace())}))}}for(var V=g.getEnumerator();V.moveNext();){var k=V.get_current(),B=k.get_item("FileLeafRef"),X=B.substring(0,B.lastIndexOf(".")),U=B.replace(X,""),ie=k.get_item("ResponseID"),re=X.replace(ie+"_","");re.indexOf("_")>=0&&(re=re.substring(0,re.indexOf("_")));var N="";e!=null&&e!=""&&e!="None"?N=ie+"_"+re+"_"+e+U:N=ie+"_"+re+U,N!=""&&(k.set_item("FileLeafRef",N),k.update()),Q.push(new Promise((Ae,be)=>{r.executeQueryAsync(Ae,be)}).catch((Ae,be)=>{alert("Error occurred updating sensitivity title on External Auditor Response document: "+Y+" to "+N+" "+be.get_message()+`
`+be.get_stackTrace())}))}s==null&&(s="");for(var ye=S.getEnumerator();ye.moveNext();){var k=ye.get_current(),B=k.get_item("FileLeafRef"),N=cn(k,s,e);N!=""&&(k.set_item("FileLeafRef",N),k.update()),Q.push(new Promise((be,qe)=>{r.executeQueryAsync(be,qe)}).catch((be,qe)=>{alert("Error occurred updating sensitivity title on Request document: "+Y+" to "+N+" "+qe.get_message()+`
`+qe.get_stackTrace())}))}for(var ae=D.getEnumerator();ae.moveNext();){var k=ae.get_current(),B=k.get_item("FileLeafRef"),N=cn(k,s,e);N!=""&&(k.set_item("FileLeafRef",N),k.update()),Q.push(new Promise((be,qe)=>{r.executeQueryAsync(be,qe)}).catch((be,qe)=>{alert("Error occurred updating sensitivity title on Coversheet document: "+Y+" to "+N+" "+qe.get_message()+`
`+qe.get_stackTrace())}))}return await Promise.all(Q),!0}function cn(t,e,s){var n=null,o=t.get_item("FileLeafRef"),r=o.substring(0,o.lastIndexOf(".")),a=o.replace(r,"");return n=r,e!=null&&e!=""&&r.endsWith("_"+e)&&(n=n.replace("_"+e,"")),s!=null&&s!=""&&s!="None"&&(r.endsWith("_"+s)||(n=n+"_"+s)),n}function Os(t,e,s){var n=t.get_item("Created"),o=e+"_"+n.format("yyyyMMddTHHmmss")+"_"+Math.ceil(Math.random()*1e4);s!=null&&s!=""&&s!="None"&&(o+="_"+s);var r=t.get_item("FileLeafRef"),a=r.substring(0,r.lastIndexOf(".")),l=r.replace(a,"");return o+=l,o}async function At(t,e=!1,s,n){if(e&&alert("trying to refresh page!"),!ue)return;let o=pe(me.permissionsRequest);var r=new SP.ClientContext.get_current,a=r.get_web();let l=a.get_currentUser(),u=a.get_associatedOwnerGroup(),d=a.get_associatedMemberGroup(),m=a.get_associatedVisitorGroup();var p=Audit.Common.Utilities.CheckSPItemHasGroupPermission(t,Audit.Common.Utilities.GetGroupNameQA(),SP.PermissionKind.viewListItems),g=Audit.Common.Utilities.CheckSPItemHasGroupPermission(t,Audit.Common.Utilities.GetGroupNameSpecialPerm1(),SP.PermissionKind.viewListItems),b=Audit.Common.Utilities.CheckSPItemHasGroupPermission(t,Audit.Common.Utilities.GetGroupNameSpecialPerm2(),SP.PermissionKind.viewListItems);t.resetRoleInheritance(),t.breakRoleInheritance(!1,!1);var h=SP.RoleDefinitionBindingCollection.newObject(r);h.add(a.get_roleDefinitions().getByType(SP.RoleType.administrator));var S=SP.RoleDefinitionBindingCollection.newObject(r);S.add(a.get_roleDefinitions().getByType(SP.RoleType.contributor));var A=SP.RoleDefinitionBindingCollection.newObject(r);A.add(a.get_roleDefinitions().getByName("Restricted Read"));var w=SP.RoleDefinitionBindingCollection.newObject(r);if(w.add(a.get_roleDefinitions().getByName("Restricted Contribute")),t.get_roleAssignments().add(u,h),t.get_roleAssignments().add(d,S),t.get_roleAssignments().add(m,A),p||s=="4-Approved for QA"){var D=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameQA());D!=null&&t.get_roleAssignments().add(D,A)}if(g){var k=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameSpecialPerm1());k!=null&&t.get_roleAssignments().add(k,A)}if(b){var G=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameSpecialPerm2());G!=null&&t.get_roleAssignments().add(G,A)}t.get_roleAssignments().getByPrincipal(l).deleteObject(),await new Promise((Q,L)=>{function W(){let V=0,B=0;var X=t.get_item("ActionOffice");if(X!=null&&X.length>0)for(var U=0;U<X.length;U++){var ie=X[U].get_lookupValue(),re=Audit.Common.Utilities.GetAOSPGroupName(ie),ye=Audit.Common.Utilities.GetSPSiteGroup(re);if(ye!=null){let be=function(){B++,B==V&&Q(!0)},qe=function(vt,Ft){B++,B==V&&Q(!0)};V++;var ae=new SP.ClientContext.get_current,lt=ae.get_web(),oe=SP.RoleDefinitionBindingCollection.newObject(ae);oe.add(lt.get_roleDefinitions().getByName("Restricted Read")),this.oListItem.get_roleAssignments().add(ye,oe);var Ae={refreshPage:this.refreshPage,resolve:Q};ae.executeQueryAsync(Function.createDelegate(Ae,be),Function.createDelegate(Ae,qe))}}else Q(!0)}function Y(V,B){SP.UI.Notify.addNotification("Failed to update permissions on Request: "+this.title+B.get_message()+`
`+B.get_stackTrace(),!1),this.reject(V,B)}var N={title:t.get_item("Title"),refreshPage:e,oListItem:t,resolve:Q,reject:L,OnComplete:n};r.executeQueryAsync(Function.createDelegate(N,W),Function.createDelegate(N,Y))}),de(o)}var rn=0,Ai=0;async function Yl(t,e,s,n){let o=pe(me.permissionsEmailFolder);var r=new SP.ClientContext.get_current,a=r.get_web();let l=a.get_currentUser(),u=a.get_associatedOwnerGroup(),d=a.get_associatedMemberGroup(),m=a.get_associatedVisitorGroup();t.resetRoleInheritance(),t.breakRoleInheritance(!1,!1);var p=SP.RoleDefinitionBindingCollection.newObject(r);p.add(a.get_roleDefinitions().getByType(SP.RoleType.administrator));var g=SP.RoleDefinitionBindingCollection.newObject(r);g.add(a.get_roleDefinitions().getByType(SP.RoleType.contributor));var b=SP.RoleDefinitionBindingCollection.newObject(r);b.add(a.get_roleDefinitions().getByName("Restricted Read"));var h=SP.RoleDefinitionBindingCollection.newObject(r);h.add(a.get_roleDefinitions().getByName("Restricted Contribute")),t.get_roleAssignments().add(u,p),t.get_roleAssignments().add(d,g),t.get_roleAssignments().add(m,b);var S=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameQA());S!=null&&t.get_roleAssignments().add(S,h),t.get_roleAssignments().getByPrincipal(l).deleteObject(),await new Promise((A,w)=>{function D(){this.oRequestItem||A();var Q=this.oRequestItem.get_item("ActionOffice");if(Q!=null&&Q.length>0)for(var L=0;L<Q.length;L++){var W=Q[L].get_lookupValue(),Y=Audit.Common.Utilities.GetAOSPGroupName(W),N=Audit.Common.Utilities.GetSPSiteGroup(Y);if(N!=null){let ie=function(){Ai++,Ai==rn&&A()},re=function(ye,ae){Ai++,Ai==rn&&w({sender:ye,args:ae})};rn++;var V=new SP.ClientContext.get_current,B=r.get_web(),X=SP.RoleDefinitionBindingCollection.newObject(V);X.add(B.get_roleDefinitions().getByName("Restricted Contribute")),this.oListItem.get_roleAssignments().add(N,X);var U={refreshPage:this.refreshPage,OnComplete:this.OnComplete};V.executeQueryAsync(Function.createDelegate(U,ie),Function.createDelegate(U,re))}}}function k(Q,L){w({sender:Q,args:L})}var G={title:t.get_item("Title"),refreshPage:s,oListItem:t,oRequestItem:e,OnComplete:n};r.executeQueryAsync(Function.createDelegate(G,D),Function.createDelegate(G,k))}),de(o)}var xs=0,us=0,Es=new Object;async function Us(t,e){if(t==null)return;let s=pe(me.permissionsCoversheet);var n=new SP.ClientContext.get_current,o=n.get_web(),r=n.get_web().get_currentUser(),a=o.get_associatedOwnerGroup(),l=o.get_associatedMemberGroup(),u=o.get_associatedVisitorGroup(),d=Audit.Common.Utilities.CheckSPItemHasGroupPermission(t,Audit.Common.Utilities.GetGroupNameQA(),SP.PermissionKind.viewListItems),m=Audit.Common.Utilities.CheckSPItemHasGroupPermission(t,Audit.Common.Utilities.GetGroupNameSpecialPerm1(),SP.PermissionKind.viewListItems),p=Audit.Common.Utilities.CheckSPItemHasGroupPermission(t,Audit.Common.Utilities.GetGroupNameSpecialPerm2(),SP.PermissionKind.viewListItems);t.get_hasUniqueRoleAssignments()||(d=!1,m=!1,p=!1),t.resetRoleInheritance(),t.breakRoleInheritance(!1,!1);var g=SP.RoleDefinitionBindingCollection.newObject(n);g.add(n.get_web().get_roleDefinitions().getByType(SP.RoleType.administrator));var b=SP.RoleDefinitionBindingCollection.newObject(n);b.add(n.get_web().get_roleDefinitions().getByType(SP.RoleType.contributor));var h=SP.RoleDefinitionBindingCollection.newObject(n);h.add(n.get_web().get_roleDefinitions().getByName("Restricted Read"));var S=SP.RoleDefinitionBindingCollection.newObject(n);if(S.add(n.get_web().get_roleDefinitions().getByName("Restricted Contribute")),t.get_roleAssignments().add(a,g),t.get_roleAssignments().add(l,b),t.get_roleAssignments().add(u,h),d||e){var A=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameQA());A!=null&&t.get_roleAssignments().add(A,h)}if(m){var w=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameSpecialPerm1());w!=null&&t.get_roleAssignments().add(w,h)}if(p){var D=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameSpecialPerm2());D!=null&&t.get_roleAssignments().add(D,h)}t.get_roleAssignments().getByPrincipal(r).deleteObject(),await new Promise((k,G)=>{async function Q(){var Y=new SP.ClientContext.get_current,N=SP.RoleDefinitionBindingCollection.newObject(Y);N.add(Y.get_web().get_roleDefinitions().getByName("Restricted Read"));var V=this.oListItem.get_item("ActionOffice");(V==null||V.length==0)&&k(),await Promise.all(V.map(B=>{var X=B.get_lookupValue(),U=Audit.Common.Utilities.GetAOSPGroupName(X),ie=Audit.Common.Utilities.GetSPSiteGroup(U);return ie}).filter(B=>B!=null).map(B=>{var X=SP.RoleDefinitionBindingCollection.newObject(Y);return X.add(Y.get_web().get_roleDefinitions().getByName("Restricted Read")),this.oListItem.get_roleAssignments().add(B,X),new Promise((U,ie)=>{Y.executeQueryAsync(U,ie)})})),k(!0)}function L(Y,N){SP.UI.Notify.addNotification("Failed to update permissions on Coversheet"+N.get_message()+`
`+N.get_stackTrace(),!1),k(!0)}var W={oListItem:t};n.executeQueryAsync(Function.createDelegate(W,Q),Function.createDelegate(W,L))}),de(s)}async function Xl(t,e,s,n,o){if(e==null)return;let r=pe(me.permissionsCoversheet);var a=t.get_web();let l=t.get_web().get_currentUser(),u=a.get_associatedOwnerGroup(),d=a.get_associatedMemberGroup(),m=a.get_associatedVisitorGroup();e.resetRoleInheritance(),e.breakRoleInheritance(!1,!1);var p=Audit.Common.Utilities.CheckSPItemHasGroupPermission(e,Audit.Common.Utilities.GetGroupNameQA(),SP.PermissionKind.viewListItems),g=SP.RoleDefinitionBindingCollection.newObject(t);g.add(t.get_web().get_roleDefinitions().getByType(SP.RoleType.administrator));var b=SP.RoleDefinitionBindingCollection.newObject(t);b.add(t.get_web().get_roleDefinitions().getByType(SP.RoleType.contributor));var h=SP.RoleDefinitionBindingCollection.newObject(t);h.add(t.get_web().get_roleDefinitions().getByName("Restricted Read"));var S=SP.RoleDefinitionBindingCollection.newObject(t);if(S.add(t.get_web().get_roleDefinitions().getByName("Restricted Contribute")),e.get_roleAssignments().add(u,g),e.get_roleAssignments().add(d,b),e.get_roleAssignments().add(m,h),p){var A=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameQA());A!=null&&e.get_roleAssignments().add(A,h)}if(s){var w=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameSpecialPerm1());w!=null&&e.get_roleAssignments().add(w,h);var D=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameSpecialPerm2());D!=null&&e.get_roleAssignments().add(D,h)}e.get_roleAssignments().getByPrincipal(l).deleteObject(),await new Promise((V,B)=>{t.executeQueryAsync(V,(X,U)=>B({sender:X,args:U}))}).catch(V=>{});var k=new SP.ClientContext.get_current,G=this.oListItem.get_item("ActionOffice");if(G==null||G.length==0){this.OnComplete&&this.OnComplete(!0);return}var Q=this.oListItem.get_item("ID");Es[Q+"toAdd"]=0,Es[Q+"added"]=0;for(var L=0;L<G.length;L++){var W=G[L].get_lookupValue(),Y=Audit.Common.Utilities.GetAOSPGroupName(W),N=Audit.Common.Utilities.GetSPSiteGroup(Y);if(N!=null){Es[Q+"toAdd"]=Es[Q+"toAdd"]+1;var h=SP.RoleDefinitionBindingCollection.newObject(k);h.add(k.get_web().get_roleDefinitions().getByName("Restricted Read")),this.oListItem.get_roleAssignments().add(N,h),await new Promise((B,X)=>{k.executeQueryAsync(B,X)}).catch(B=>{console.error("Error setting special perms: ",Y)})}}de(r)}async function Vs(t,e,s=!1,n=!1,o=!1,r=!1){if(!ue)return;let a=pe(me.permissionsResponseAndFolder(e.title));var l=new SP.ClientContext.get_current,u=l.get_web();let d=l.get_web().get_currentUser(),m=u.get_associatedOwnerGroup(),p=u.get_associatedMemberGroup(),g=u.get_associatedVisitorGroup();var b=Audit.Common.Utilities.CheckSPItemHasGroupPermission(e.item,Audit.Common.Utilities.GetGroupNameQA(),SP.PermissionKind.viewListItems),h=Audit.Common.Utilities.CheckSPItemHasGroupPermission(e.item,Audit.Common.Utilities.GetGroupNameSpecialPerm1(),SP.PermissionKind.viewListItems),S=Audit.Common.Utilities.CheckSPItemHasGroupPermission(e.item,Audit.Common.Utilities.GetGroupNameSpecialPerm2(),SP.PermissionKind.viewListItems);e.item.get_hasUniqueRoleAssignments()||(b=!1,h=!1,S=!1),o?(h=!0,S=!0):r&&(h=!1,S=!1),e.item.resetRoleInheritance(),e.item.breakRoleInheritance(!1,!1),e.responseFolderItem&&(e.responseFolderItem.resetRoleInheritance(),e.responseFolderItem.breakRoleInheritance(!1,!1));var A=SP.RoleDefinitionBindingCollection.newObject(l);A.add(l.get_web().get_roleDefinitions().getByType(SP.RoleType.administrator));var w=SP.RoleDefinitionBindingCollection.newObject(l);w.add(l.get_web().get_roleDefinitions().getByType(SP.RoleType.contributor));var D=SP.RoleDefinitionBindingCollection.newObject(l);D.add(l.get_web().get_roleDefinitions().getByName("Restricted Read"));var k=SP.RoleDefinitionBindingCollection.newObject(l);if(k.add(l.get_web().get_roleDefinitions().getByName("Restricted Contribute")),e.item.get_roleAssignments().add(m,A),e.item.get_roleAssignments().add(p,w),e.item.get_roleAssignments().add(g,D),e.responseFolderItem&&(e.responseFolderItem.get_roleAssignments().add(m,A),e.responseFolderItem.get_roleAssignments().add(p,w),e.responseFolderItem.get_roleAssignments().add(g,D)),b||e.item.get_item("ResStatus")=="4-Approved for QA"||e.item.get_item("ResStatus")=="6-Reposted After Rejection"){var G=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameQA());G!=null&&(n&&(e.item.get_item("ResStatus")=="4-Approved for QA"||e.item.get_item("ResStatus")=="6-Reposted After Rejection")&&(t=="Open"||t=="ReOpened")?(e.item.get_roleAssignments().add(G,k),e.responseFolderItem&&e.responseFolderItem.get_roleAssignments().add(G,k)):(e.item.get_roleAssignments().add(G,D),e.responseFolderItem&&e.responseFolderItem.get_roleAssignments().add(G,D)))}if(h&&(e.item.get_item("ResStatus")=="4-Approved for QA"||e.item.get_item("ResStatus")=="6-Reposted After Rejection"||e.item.get_item("ResStatus")=="7-Closed")){var Q=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameSpecialPerm1());Q!=null&&(e.item.get_roleAssignments().add(Q,D),e.responseFolderItem&&e.responseFolderItem.get_roleAssignments().add(Q,D))}if(S&&(e.item.get_item("ResStatus")=="4-Approved for QA"||e.item.get_item("ResStatus")=="6-Reposted After Rejection"||e.item.get_item("ResStatus")=="7-Closed")){var L=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameSpecialPerm2());L!=null&&(e.item.get_roleAssignments().add(L,D),e.responseFolderItem&&e.responseFolderItem.get_roleAssignments().add(L,D))}var W=e.item.get_item("ActionOffice");if(W!=null){var Y=W.get_lookupValue(),N=Audit.Common.Utilities.GetAOSPGroupName(Y),V=Audit.Common.Utilities.GetSPSiteGroup(N);V!=null&&(n&&(e.item.get_item("ResStatus")=="1-Open"||e.item.get_item("ResStatus")=="3-Returned to Action Office")&&(t=="Open"||t=="ReOpened")?(e.item.get_roleAssignments().add(V,k),e.responseFolderItem&&e.responseFolderItem.get_roleAssignments().add(V,k)):(e.item.get_roleAssignments().add(V,D),e.responseFolderItem&&e.responseFolderItem.get_roleAssignments().add(V,D)))}e.item.get_roleAssignments().getByPrincipal(d).deleteObject(),e.responseFolderItem&&e.responseFolderItem.get_roleAssignments().getByPrincipal(d).deleteObject(),await new Promise((B,X)=>{l.executeQueryAsync(B,(U,ie)=>{SP.UI.Notify.addNotification("Failed to update permissions on Response: "+e.item.get_item("Title")+ie.get_message()+`
`+ie.get_stackTrace(),!1),X({sender:U,args:ie})})}),de(a)}async function _i(t,e,s){if(!ue)return;let n=pe(me.permissionsResponse(t.get_item("Title")));var o=new SP.ClientContext.get_current,r=o.get_web();let a=o.get_web().get_currentUser(),l=r.get_associatedOwnerGroup(),u=r.get_associatedMemberGroup(),d=r.get_associatedVisitorGroup();var m=SP.PermissionKind.viewListItems,p=Audit.Common.Utilities.CheckSPItemHasGroupPermission(t,Audit.Common.Utilities.GetGroupNameQA(),m),g=Audit.Common.Utilities.CheckSPItemHasGroupPermission(t,Audit.Common.Utilities.GetGroupNameSpecialPerm1(),SP.PermissionKind.viewListItems),b=Audit.Common.Utilities.CheckSPItemHasGroupPermission(t,Audit.Common.Utilities.GetGroupNameSpecialPerm2(),SP.PermissionKind.viewListItems);t.get_hasUniqueRoleAssignments()||(p=!1,g=!1,b=!1),t.resetRoleInheritance(),t.breakRoleInheritance(!1,!1);var h=SP.RoleDefinitionBindingCollection.newObject(o);h.add(o.get_web().get_roleDefinitions().getByType(SP.RoleType.administrator));var S=SP.RoleDefinitionBindingCollection.newObject(o);S.add(o.get_web().get_roleDefinitions().getByType(SP.RoleType.contributor));var A=SP.RoleDefinitionBindingCollection.newObject(o);A.add(o.get_web().get_roleDefinitions().getByName("Restricted Read"));var w=SP.RoleDefinitionBindingCollection.newObject(o);w.add(o.get_web().get_roleDefinitions().getByName("Restricted Contribute")),t.get_roleAssignments().add(l,h),t.get_roleAssignments().add(u,S),t.get_roleAssignments().add(d,A);var D=t.get_item("ActionOffice");if(D!=null){var k=D.get_lookupValue(),G=Audit.Common.Utilities.GetAOSPGroupName(k),Q=Audit.Common.Utilities.GetSPSiteGroup(G);Q!=null&&(s&&(t.get_item("ResStatus")=="1-Open"||t.get_item("ResStatus")=="3-Returned to Action Office")?t.get_roleAssignments().add(Q,w):t.get_roleAssignments().add(Q,A))}if(p||t.get_item("ResStatus")=="4-Approved for QA"||t.get_item("ResStatus")=="6-Reposted After Rejection"){var L=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameQA());L!=null&&((t.get_item("ResStatus")=="4-Approved for QA"||t.get_item("ResStatus")=="6-Reposted After Rejection")&&s?t.get_roleAssignments().add(L,w):t.get_roleAssignments().add(L,A))}if(g&&(t.get_item("ResStatus")=="4-Approved for QA"||t.get_item("ResStatus")=="6-Reposted After Rejection"||t.get_item("ResStatus")=="7-Closed")){var W=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameSpecialPerm1());W!=null&&t.get_roleAssignments().add(W,A)}if(b&&(t.get_item("ResStatus")=="4-Approved for QA"||t.get_item("ResStatus")=="6-Reposted After Rejection"||t.get_item("ResStatus")=="7-Closed")){var Y=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameSpecialPerm2());Y!=null&&t.get_roleAssignments().add(Y,A)}t.get_roleAssignments().getByPrincipal(a).deleteObject(),await new Promise((N,V)=>o.executeQueryAsync(N,(B,X)=>V({sender:B,args:X}))).catch(N=>{console.error("Failed to update permissions on response: ",t)}),e&&Ne(),de(n)}async function jr(t,e,s,n,o){if(!ue)return;let r=pe(me.permissionsResponseFolder(e.get_item("Title")));var a=new SP.ClientContext.get_current,l=a.get_web();let u=a.get_web().get_currentUser(),d=l.get_associatedOwnerGroup(),m=l.get_associatedMemberGroup(),p=l.get_associatedVisitorGroup();var g=Audit.Common.Utilities.CheckSPItemHasGroupPermission(t,Audit.Common.Utilities.GetGroupNameQA(),SP.PermissionKind.viewListItems),b=Audit.Common.Utilities.CheckSPItemHasGroupPermission(t,Audit.Common.Utilities.GetGroupNameSpecialPerm1(),SP.PermissionKind.viewListItems),h=Audit.Common.Utilities.CheckSPItemHasGroupPermission(t,Audit.Common.Utilities.GetGroupNameSpecialPerm2(),SP.PermissionKind.viewListItems);t.get_hasUniqueRoleAssignments()||(g=!1,b=!1,h=!1),t.resetRoleInheritance(),t.breakRoleInheritance(!1,!1);var S=SP.RoleDefinitionBindingCollection.newObject(a);S.add(a.get_web().get_roleDefinitions().getByType(SP.RoleType.administrator));var A=SP.RoleDefinitionBindingCollection.newObject(a);A.add(a.get_web().get_roleDefinitions().getByType(SP.RoleType.contributor));var w=SP.RoleDefinitionBindingCollection.newObject(a);w.add(a.get_web().get_roleDefinitions().getByName("Restricted Read"));var D=SP.RoleDefinitionBindingCollection.newObject(a);D.add(a.get_web().get_roleDefinitions().getByName("Restricted Contribute")),t.get_roleAssignments().add(d,S),t.get_roleAssignments().add(m,A),t.get_roleAssignments().add(p,w);var k=e.get_item("ActionOffice");if(k!=null){var G=k.get_lookupValue(),Q=Audit.Common.Utilities.GetAOSPGroupName(G),L=Audit.Common.Utilities.GetSPSiteGroup(Q);L!=null&&(n&&(e.get_item("ResStatus")=="1-Open"||e.get_item("ResStatus")=="3-Returned to Action Office")?t.get_roleAssignments().add(L,D):t.get_roleAssignments().add(L,w))}if(g||e.get_item("ResStatus")=="4-Approved for QA"||e.get_item("ResStatus")=="6-Reposted After Rejection"){var W=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameQA());W!=null&&(n&&(e.get_item("ResStatus")=="4-Approved for QA"||e.get_item("ResStatus")=="6-Reposted After Rejection")?t.get_roleAssignments().add(W,D):t.get_roleAssignments().add(W,w))}if(b&&(e.get_item("ResStatus")=="4-Approved for QA"||e.get_item("ResStatus")=="6-Reposted After Rejection"||e.get_item("ResStatus")=="7-Closed")){var Y=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameSpecialPerm1());Y!=null&&t.get_roleAssignments().add(Y,w)}if(h&&(e.get_item("ResStatus")=="4-Approved for QA"||e.get_item("ResStatus")=="6-Reposted After Rejection"||e.get_item("ResStatus")=="7-Closed")){var N=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameSpecialPerm2());N!=null&&t.get_roleAssignments().add(N,w)}t.get_roleAssignments().getByPrincipal(u).deleteObject(),await Gt(a).catch(V=>console.error("Failed to update permissions on Response Folder: ",e.get_item("Title"))),de(r)}var ds=0,Qt=0;function Wr(t,e){if(t==null){e&&e(!0);return}ds=0,Qt=0;var s=t.item.get_item("ActionOffice");if(s==null||s.length==0){this.OnComplete&&this.OnComplete(!0);return}for(var n=0;n<s.length;n++){var o=s[n].get_lookupValue(),r=Audit.Common.Utilities.GetAOSPGroupName(o),a=Audit.Common.Utilities.GetSPSiteGroup(r);if(a!=null){let p=function(){Qt++,$("#divGrantCntr").text("Ensured "+Qt+" of "+ds+" Action Offices have permissions to Request"),Qt==ds&&this.OnComplete&&this.OnComplete(!0)},g=function(b,h){Qt++,$("#divGrantCntr").text("Ensured "+Qt+" of "+ds+" Action Offices have permissions to Request"),Qt==ds&&this.OnComplete&&this.OnComplete(!0)};ds++;var l=new SP.ClientContext.get_current,u=l.get_web(),d=SP.RoleDefinitionBindingCollection.newObject(l);d.add(l.get_web().get_roleDefinitions().getByName("Restricted Read")),t.item.get_roleAssignments().add(a,d);var m={OnComplete:e};l.executeQueryAsync(Function.createDelegate(m,p),Function.createDelegate(m,g))}}}function Kr(t,e,s,n){if(xs=0,us=0,t==null||t.coversheets==null||t.coversheets.length==0){n&&n(!0);return}Es=new Object;for(var o=0;o<t.coversheets.length;o++){var r=t.coversheets[o].item;if(r){xs++;var a=!1;Xl(e,r,s,!1,function(l){us++,$("#divGrantCntr").text("Updated "+us+" of "+xs+" Coversheet permissions"),us==xs&&n&&n(!0)})}}}var an=0,ln=0;async function Yr(t,e,s){if(t==null||t.responses==null||t.responses.length==0){s&&s(!0);return}for(var n=0;n<t.responses.length;n++){var o=t.responses[n];if(o.resStatus=="4-Approved for QA"||o.resStatus=="6-Reposted After Rejection"||o.resStatus=="7-Closed"){an++;var r=!1,a=!1,l=!1;e?a=!0:l=!0,await Vs(t.status,o,!1,!0,a,l),ln++,$("#divGrantCntr").text("Updated "+ln+" of "+an+" Response permissions"),ln==an&&s&&s(!0)}}}function zl(t){if(!ue){SP.UI.Notify.addNotification("You do not have access to perform this action...",!1);return}var e=qt(t);if(e!=null){fe=!0;for(var s=0,n=0,o=e.responses.length,r=0;r<o;r++){var a=e.responses[r];(a.resStatus=="4-Approved for QA"||a.resStatus=="6-Reposted After Rejection"||a.resStatus=="7-Closed")&&n++}if(confirm("Are you sure you would like to grant special permissions on this Request and to ("+n+") Responses?")){let W=function(){var N=!1;Wr(e,function(V){if(V){var B=!1;Kr(e,d,!0,function(X){if(X){var U=e.responses.length;if(U==0||n==0){d.executeQueryAsync(function(){document.body.style.cursor="default",Rt=SP.UI.Notify.addNotification("Completed granting Special Permissions",!1),setTimeout(function(){D.close(),Ne()},200)},function(re,ye){document.body.style.cursor="default",Rt=SP.UI.Notify.addNotification("Request failed1: "+ye.get_message()+`
`+ye.get_stackTrace(),!1),setTimeout(function(){ve()},200)});return}else{var ie=!1;Yr(e,!0,function(re){re?(document.body.style.cursor="default",Rt=SP.UI.Notify.addNotification("Completed granting Special Permissions",!1),setTimeout(function(){D(),Ne()},200)):(document.body.style.cursor="default",Rt=SP.UI.Notify.addNotification("Unable to update all responses and folders",!1),setTimeout(function(){ve()},200))})}}})}})},Y=function(N,V){},D=SP.UI.ModalDialog.showWaitScreenWithNoClose("Information","Please wait... granting Special Permissions to Request and Responses <div id='divGrantCntr'></div>",200,600);var l=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameSpecialPerm1()),u=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameSpecialPerm2()),d=SP.ClientContext.get_current(),m=d.get_web();let k=m.get_currentUser(),G=m.get_associatedOwnerGroup(),Q=m.get_associatedMemberGroup(),L=m.get_associatedVisitorGroup();var p=Audit.Common.Utilities.CheckSPItemHasGroupPermission(e.item,Audit.Common.Utilities.GetGroupNameQA(),SP.PermissionKind.viewListItems);e.item.resetRoleInheritance(),e.item.breakRoleInheritance(!1,!1);var g=SP.RoleDefinitionBindingCollection.newObject(d);g.add(d.get_web().get_roleDefinitions().getByType(SP.RoleType.administrator));var b=SP.RoleDefinitionBindingCollection.newObject(d);b.add(d.get_web().get_roleDefinitions().getByType(SP.RoleType.contributor));var h=SP.RoleDefinitionBindingCollection.newObject(d);h.add(d.get_web().get_roleDefinitions().getByName("Restricted Read"));var S=SP.RoleDefinitionBindingCollection.newObject(d);if(S.add(d.get_web().get_roleDefinitions().getByName("Restricted Contribute")),e.item.get_roleAssignments().add(G,g),e.item.get_roleAssignments().add(Q,b),e.item.get_roleAssignments().add(L,h),l!=null&&e.item.get_roleAssignments().add(l,h),u!=null&&e.item.get_roleAssignments().add(u,h),p){var A=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameQA());A!=null&&e.item.get_roleAssignments().add(A,h)}e.item.get_roleAssignments().getByPrincipal(k).deleteObject();var w={oRequest:e};d.executeQueryAsync(Function.createDelegate(w,W),Function.createDelegate(w,Y))}else fe=!1}}function Jl(t){if(!ue){SP.UI.Notify.addNotification("You do not have access to perform this action...",!1);return}var e=qt(t);if(e!=null){fe=!0;for(var s=0,n=0,o=e.responses.length,r=0;r<o;r++){var a=e.responses[r];(a.resStatus=="4-Approved for QA"||a.resStatus=="6-Reposted After Rejection"||a.resStatus=="7-Closed")&&n++}if(confirm("Are you sure you would like to remove special permissions on this Request and on ("+n+") Responses?")){let W=function(){var N=!1;Wr(e,function(V){if(V){var B=!1;Kr(e,l,!1,function(X){if(X){var U=e.responses.length;if(U==0||n==0){l.executeQueryAsync(function(){document.body.style.cursor="default",Rt=SP.UI.Notify.addNotification("Completed removing Special Permissions",!1),setTimeout(function(){ve()},200)},function(re,ye){document.body.style.cursor="default",Rt=SP.UI.Notify.addNotification("Request failed1: "+ye.get_message()+`
`+ye.get_stackTrace(),!1),setTimeout(function(){ve()},200)});return}else{var ie=!1;Yr(e,!1,function(re){re?(document.body.style.cursor="default",Rt=SP.UI.Notify.addNotification("Completed removing Special Permissions",!1),setTimeout(function(){ve()},200)):(document.body.style.cursor="default",Rt=SP.UI.Notify.addNotification("Unable to update all responses and folders",!1),setTimeout(function(){ve()},200))})}}})}})},Y=function(N,V){},D=SP.UI.ModalDialog.showWaitScreenWithNoClose("Information","Please wait... removing Special Permissions on Request and Responses <div id='divGrantCntr'></div>",200,600);var l=SP.ClientContext.get_current(),u=l.get_web();let k=u.get_currentUser(),G=u.get_associatedOwnerGroup(),Q=u.get_associatedMemberGroup(),L=u.get_associatedVisitorGroup();var d=Audit.Common.Utilities.CheckSPItemHasGroupPermission(e.item,Audit.Common.Utilities.GetGroupNameQA(),SP.PermissionKind.viewListItems),m=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameSpecialPerm1()),p=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameSpecialPerm2());e.item.resetRoleInheritance(),e.item.breakRoleInheritance(!1,!1);var g=SP.RoleDefinitionBindingCollection.newObject(l);g.add(l.get_web().get_roleDefinitions().getByType(SP.RoleType.administrator));var b=SP.RoleDefinitionBindingCollection.newObject(l);b.add(l.get_web().get_roleDefinitions().getByType(SP.RoleType.contributor));var h=SP.RoleDefinitionBindingCollection.newObject(l);h.add(l.get_web().get_roleDefinitions().getByName("Restricted Read"));var S=SP.RoleDefinitionBindingCollection.newObject(l);if(S.add(l.get_web().get_roleDefinitions().getByName("Restricted Contribute")),e.item.get_roleAssignments().add(G,g),e.item.get_roleAssignments().add(Q,b),e.item.get_roleAssignments().add(L,h),d){var A=Audit.Common.Utilities.GetSPSiteGroup(Audit.Common.Utilities.GetGroupNameQA());A!=null&&e.item.get_roleAssignments().add(A,h)}e.item.get_roleAssignments().getByPrincipal(k).deleteObject();var w={oRequest:e};l.executeQueryAsync(Function.createDelegate(w,W),Function.createDelegate(w,Y))}else fe=!1}}function fn(){var t=location.pathname+"?",e=$("#ddlReqNum").val();e!=""&&(t+="%26ReqNum="+e);var s="&Source="+t;return s}function Et(t,e){t===SP.UI.DialogResult.OK?Ne():fe=!1}function Zl(t,e){t===SP.UI.DialogResult.OK?ve():fe=!1}function eu(t,e){if(t!==SP.UI.DialogResult.OK)return;let s=pe(me.newRequest);var n=new SP.ClientContext.get_current,o=n.get_web(),r=o.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequests()),a=new SP.CamlQuery;a.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID" Ascending="FALSE"/></OrderBy></Query><RowLimit>1</RowLimit></View>');let l=r.getItems(a);n.load(l,"Include(ID, Title, ReqType, ActionOffice, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))");let u=o.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory());var d=new SP.CamlQuery;d.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>');let m=u.getItems(d);n.load(m,"Include(ID, Title, DisplayName)"),n.executeQueryAsync(async function(){for(var p=null,g=l.getEnumerator();g.moveNext();){p=g.get_current();break}if(p)if(Xr(p.get_item("ID")),p.get_hasUniqueRoleAssignments()){var h=!1;Audit.Common.Utilities.CreateEmailFolder(u,p.get_item("Title"),p,function(A){j.tabs.selectTab(j.tabOpts.RequestDetail),de(s),Ne(p.get_item("ID"))})}else{var b=!1;await At(p,!1,null);var h=!1;Audit.Common.Utilities.CreateEmailFolder(u,p.get_item("Title"),p,function(S){j.tabs.selectTab(j.tabOpts.RequestDetail),de(s),Ne(p.get_item("ID"))})}},function(p,g){ve()})}function Xr(t){var e=new SP.ClientContext.get_current,s=e.get_web(),n=s.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequestsInternal()),o=new SP.ListItemCreationInformation,r=n.addItem(o);r.set_item("ReqNum",t),r.update(),e.executeQueryAsync(function(){},function(a,l){alert("error creating internal request item"),console.error(a,l)})}async function zr(t,e,s,n){var o=0,r=Se["request-"+e];if(r){var a=r.responses.length;for(let l of r.responses)await Vs(t,l,!1,s,!1,!1),o++}}function tu(t,e,s){for(var n=0;n<t.responses.length;n++){var o=new SP.ClientContext.get_current,r=o.get_web(),a=t.responses[n].title,l=a.replace(e,s);t.responses[n].item.set_item("Title",l),t.responses[n].item.update(),o.executeQueryAsync(function(){},function(u,d){})}}function su(t,e,s){for(var n=t.getEnumerator();n.moveNext();){var o=new SP.ClientContext.get_current,r=o.get_web(),a=n.get_current(),l=a.get_displayName(),u=l.replace(e,"");if(u.charAt(0)=="-"){var d=l.replace(e,s);a.set_item("FileLeafRef",d),a.set_item("Title",d),a.update(),o.executeQueryAsync(function(){},function(m,p){})}}}function iu(t,e,s){for(var n=t.getEnumerator();n.moveNext();){var o=new SP.ClientContext.get_current,r=o.get_web(),a=n.get_current(),l=a.get_displayName();if(e==l){var u=l.replace(e,s);a.set_item("FileLeafRef",u),a.set_item("Title",u),a.update(),o.executeQueryAsync(function(){},function(d,m){})}}}function nu(t,e,s){for(var n=t.getEnumerator();n.moveNext();){var o=new SP.ClientContext.get_current,r=o.get_web(),a=n.get_current(),l=a.get_displayName();if(e==l){var u=l.replace(e,s);a.set_item("FileLeafRef",u),a.set_item("Title",u),a.update(),o.executeQueryAsync(function(){},function(d,m){})}}}async function ou(t,e){if(t!==SP.UI.DialogResult.OK){fe=!1;return}fe=!0;let s=j.currentRequest(),n=SP.UI.Notify.addNotification("Please wait...",!1);document.body.style.cursor="wait";var o=new SP.ClientContext.get_current,r=o.get_web(),a=r.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleRequests()),l=new SP.CamlQuery;l.set_viewXml('<View><Query><Where><Eq><FieldRef Name="ID"/><Value Type="Text">'+Ns+"</Value></Eq></Where></Query></View>");let u=a.getItems(l);o.load(u,"Include(ID, Title, ReqType, ActionOffice, ReqStatus, Sensitivity, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))");var d=o.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs()),m=new SP.CamlQuery;m.set_viewXml('<View><Query><Where><And><BeginsWith><FieldRef Name="Title"/><Value Type="Text">'+s.number+'-</Value></BeginsWith><Eq><FieldRef Name="ContentType" /><Value Type="Text">Folder</Value></Eq></And></Where></Query></View>');let p=d.getItems(m);ue?o.load(p,"Include( DisplayName, Title, Id, EncodedAbsUrl, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"):o.load(p,"Include( DisplayName, Title, Id, EncodedAbsUrl)");var g=r.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory()),b=new SP.CamlQuery;b.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><And><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq><Eq><FieldRef Name="Title"/><Value Type="Text">'+s.number+"</Value></Eq></And></Where></Query></View>");let h=g.getItems(b);o.load(h,"Include(ID, Title, DisplayName)");var S=r.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocsEA()),A=new SP.CamlQuery;A.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>');let w=S.getItems(A);o.load(w,"Include(ID, Title, DisplayName)"),await new Promise((ie,re)=>{o.executeQueryAsync(ie,re)}).catch(ie=>{ve()});let D=Ns;for(var k=u.getEnumerator();k.moveNext();){var G=k.get_current(),Q=G.get_item("Sensitivity"),L=!1;if(Se["request-"+_e].sensitivity!=Q&&(L=!0),_e==G.get_item("Title")){var W=!1;await At(G,!1,null);var Y=!1;if(await zr(G.get_item("ReqStatus"),_e,!0),L){var N=Se["request-"+_e].sensitivity;let ie=await Kl(_e,Q,N)}for(var V=h.getEnumerator();V.moveNext();){var B=V.get_current();if(B.get_displayName()==_e){await Yl(B,G,!1);break}}}else{let ie=SP.UI.ModalDialog.showWaitScreenWithNoClose("Renaming Responses","Please wait... Renaming Responses",200,400);var W=!1;await At(G,!1,null);var X=qt(_e),U=G.get_item("Title");tu(X,_e,U),su(p,_e,U),iu(h,_e,U),nu(w,_e,U),setTimeout(function(){ve(U)},2e4)}}Ne()}function ru(t,e){if(t===SP.UI.DialogResult.OK){var s=new SP.ClientContext.get_current,n=s.get_web(),o=n.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleCoverSheets()),r=new SP.CamlQuery;r.set_viewXml('<View><Query><OrderBy><FieldRef Name="Modified" Ascending="FALSE"/></OrderBy></Query><RowLimit>1</RowLimit></View>');let l=o.getItems(r);s.load(l,"Include(ID, Title, ActionOffice, FileLeafRef, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))");var a=Se["request-"+_e].sensitivity;s.executeQueryAsync(async function(){for(var u=l.getEnumerator(),d=null;u.moveNext();){d=u.get_current();break}if(d){let b=SP.UI.ModalDialog.showWaitScreenWithNoClose("Information","Please wait... Updating permissions on Coversheet",200,600);if(await Us(d,!1),a&&a!="None"){var m=!1;await Us(d,!1);var p=cn(d,null,a);p!=""&&(d.set_item("FileLeafRef",p),d.update());var g={newFileName:p};await new Promise((h,S)=>{s.executeQueryAsync(h,S)}).catch(h=>{alert("Error updating coversheet name with sensitivity"),ve()})}b.close(),Ne()}},function(u,d){ve()})}else fe=!1}function au(t,e){$("#divRanBulkUpdate").text()==1&&Ne()}function lu(t,e){$("#divRanBulkUpdate").text()==1&&Ne()}function uu(t,e){if(t===SP.UI.DialogResult.OK){var s=new SP.ClientContext.get_current,n=s.get_web(),o=n.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleResponses()),r=new SP.CamlQuery;r.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID" Ascending="FALSE"/></OrderBy></Query><RowLimit>1</RowLimit></View>');let a=o.getItems(r);s.load(a,"Include(ID, Title, ActionOffice, ReqNum, ResStatus, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))"),s.executeQueryAsync(async function(){for(var l=null,u=a.getEnumerator();u.moveNext();){l=u.get_current(),l&&!l.get_hasUniqueRoleAssignments()&&await _i(l,!1,!0);break}if(l==null)return;var d=l.get_item("Title"),m=l.get_item("ReqNum").get_lookupValue();let p=s.get_web().get_currentUser(),g=s.get_web().get_associatedOwnerGroup(),b=s.get_web().get_associatedMemberGroup(),h=s.get_web().get_associatedVisitorGroup();var S=s.get_web().get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs()),A=new SP.ListItemCreationInformation;A.set_underlyingObjectType(SP.FileSystemObjectType.folder),A.set_leafName(d);let w=S.addItem(A);w.set_item("Title",d),w.update(),w.breakRoleInheritance(!1,!1);var D=SP.RoleDefinitionBindingCollection.newObject(s);D.add(s.get_web().get_roleDefinitions().getByType(SP.RoleType.administrator)),w.get_roleAssignments().add(g,D);var k=SP.RoleDefinitionBindingCollection.newObject(s);k.add(s.get_web().get_roleDefinitions().getByType(SP.RoleType.contributor)),w.get_roleAssignments().add(b,k);var G=SP.RoleDefinitionBindingCollection.newObject(s);G.add(s.get_web().get_roleDefinitions().getByName("Restricted Read")),w.get_roleAssignments().add(h,G);var Q=Audit.Common.Utilities.GetAOSPGroupName(l.get_item("ActionOffice").get_lookupValue()),L=Audit.Common.Utilities.GetSPSiteGroup(Q);if(L!=null){var W=SP.RoleDefinitionBindingCollection.newObject(s);W.add(s.get_web().get_roleDefinitions().getByName("Restricted Contribute")),w.get_roleAssignments().add(L,W)}w.get_roleAssignments().getByPrincipal(p).deleteObject(),s.executeQueryAsync(function(){Ne()},function(Y,N){ve()})},function(l,u){ve()})}else fe=!1}var du=0,cu=0;function mu(t,e){if(du=0,cu=0,t===SP.UI.DialogResult.OK){document.body.style.cursor="wait",Rt=SP.UI.Notify.addNotification("Please wait... ",!1);var s=new SP.ClientContext.get_current,n=s.get_web(),o=n.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleResponses()),r=new SP.CamlQuery;r.set_viewXml(`<View><Query><FieldRef Name="Modified" Ascending="FALSE"/><Where><Eq><FieldRef Name='ID'/><Value Type='Text'>`+Ns+"</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>");let A=o.getItems(r);s.load(A,"Include(ID, Title, ActionOffice, POC, POCCC, ReturnReason, ResStatus, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))");var a=n.get_lists().getByTitle(Audit.Common.Utilities.GetLibTitleResponseDocs()),l=new SP.CamlQuery;l.set_viewXml("<View><Query><Where><Eq><FieldRef Name='FileLeafRef'/><Value Type='Text'>"+Di+"</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>");let w=a.getItems(l);s.load(w,"Include( Title, DisplayName, Id, EncodedAbsUrl, HasUniqueRoleAssignments, RoleAssignments, RoleAssignments.Include(Member, RoleDefinitionBindings))");var u=Audit.Common.Utilities.GetSiteUrl()+"/"+Audit.Common.Utilities.GetLibNameResponseDocs()+"/"+Di,d=new SP.CamlQuery;d.set_viewXml(`<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name='FileDirRef'/><Value Type='Text'>`+u+"</Value></Eq><Eq><FieldRef Name='DocumentStatus'/><Value Type='Text'>Submitted</Value></Eq></And></Where></Query></View>");let D=a.getItems(d);s.load(D,"Include(ID, DocumentStatus, FileDirRef, Created, FileLeafRef)");var m=new SP.CamlQuery;m.set_viewXml(`<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name='FileDirRef'/><Value Type='Text'>`+u+"</Value></Eq><Eq><FieldRef Name='DocumentStatus'/><Value Type='Text'>Open</Value></Eq></And></Where></Query></View>");let k=a.getItems(m);s.load(k,"Include(ID, DocumentStatus, FileDirRef, Created, FileLeafRef)");var p=new SP.CamlQuery;p.set_viewXml(`<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name='FileDirRef'/><Value Type='Text'>`+u+"</Value></Eq><Eq><FieldRef Name='DocumentStatus'/><Value Type='Text'>Marked for Deletion</Value></Eq></And></Where></Query></View>");let G=a.getItems(p);s.load(G,"Include(ID, DocumentStatus, FileDirRef, Created, FileLeafRef)");var g=new SP.CamlQuery;g.set_viewXml(`<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name='FileDirRef'/><Value Type='Text'>`+u+"</Value></Eq><Eq><FieldRef Name='DocumentStatus'/><Value Type='Text'>Rejected</Value></Eq></And></Where></Query></View>");let Q=a.getItems(g);s.load(Q,"Include(ID, DocumentStatus, FileDirRef, Created, FileLeafRef)");var b=new SP.CamlQuery;b.set_viewXml(`<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name='FileDirRef'/><Value Type='Text'>`+u+"</Value></Eq><Eq><FieldRef Name='DocumentStatus'/><Value Type='Text'>Sent to QA</Value></Eq></And></Where></Query></View>");let L=a.getItems(b);s.load(L,"Include(ID, DocumentStatus, FileDirRef, Created, FileLeafRef)");var h=n.get_lists().getByTitle(Audit.Common.Utilities.GetListTitleEmailHistory()),S=new SP.CamlQuery;S.set_viewXml('<View><Query><OrderBy><FieldRef Name="ID"/></OrderBy><Where><Eq><FieldRef Name="FSObjType"/><Value Type="Text">1</Value></Eq></Where></Query></View>');let W=h.getItems(S);s.load(W,"Include(ID, Title, DisplayName)"),s.executeQueryAsync(async function(){for(var Y=null,N=null,B=A.getEnumerator();B.moveNext();){Y=B.get_current(),N=Y.get_item("Title"),await _i(Y,!1,!0);break}if(Y==null){alert("Error");return}for(var V=null,B=w.getEnumerator();B.moveNext();){V=B.get_current(),await jr(V,Y,!1,!0);break}Di!=N&&(V.set_item("FileLeafRef",N),V.set_item("Title",N),V.update());async function X(){var re=new SP.ClientContext.get_current,ye=re.get_web();if(this.oListItem.get_item("ResStatus")=="3-Returned to Action Office"&&un!=this.oListItem.get_item("ResStatus")){var ae=qt(_e),lt="Please Update your Response for Request Number: "+_e,oe="";if(this.oListItem.get_item("ResStatus")=="3-Returned to Action Office"){oe="<div>Audit Request Reference: <b>{REQUEST_NUMBER}</b></div><div>Audit Request Subject: <b>{REQUEST_SUBJECT}</b></div><div>Audit Request Due Date: <b>{REQUEST_DUEDATE}</b></div>{POC}<div>{RETURN_REASON}</div><br/><div>Please provide responses for the following Sample(s): </div><br/><div>{RESPONSE_TITLES}</div>";var Ae=this.oListItem.get_item("ReturnReason");Ae==null?Ae="":Ae="Return Reason: "+Ae,oe=oe.replace("{RETURN_REASON}",Ae)}else oe="<div>Audit Request Reference: <b>{REQUEST_NUMBER}</b></div><div>Audit Request Subject: <b>{REQUEST_SUBJECT}</b></div><div>Audit Request Due Date: <b>{REQUEST_DUEDATE}</b></div>{POC}{REQUEST_RELATEDAUDIT}<br/><div>Below are the listed action items that have been requested for the Audit: </div><div>{REQUEST_ACTIONITEMS}<br/></div><div>Please provide responses for the following Sample(s): </div><br/><div>{RESPONSE_TITLES}</div>",oe=oe.replace("{REQUEST_ACTIONITEMS}",ae.actionItems),ae.relatedAudit==null||ae.relatedAudit==""?oe=oe.replace("{REQUEST_RELATEDAUDIT}","<div>This is a new request, not similar to previous audit cycles.</div>"):oe=oe.replace("{REQUEST_RELATEDAUDIT}","<div>This request is similar to this previous cycle audit: "+ae.relatedAudit+"</div>");oe=oe.replace("{REQUEST_NUMBER}",_e),oe=oe.replace("{REQUEST_SUBJECT}",ae.subject),oe=oe.replace("{REQUEST_DUEDATE}",ae.internalDueDate),oe=oe.replace("{RESPONSE_TITLES}",this.newResponseFolderTitle);var be=this.oListItem.get_item("ActionOffice");be!=null?be=be.get_lookupValue():be="";var qe=be,vt=this.oListItem.get_item("POC");if(vt!=null){vt=vt.get_email(),qe=vt;var Ft=this.oListItem.get_item("POCCC");Ft!=null&&(qe+=";"+Ft.get_email()),oe=oe.replace("{POC}","<div><b>POC: "+vt+"</b></div><br/>")}else oe=oe.replace("{POC}","<br/>");var $t=new SP.ListItemCreationInformation;$t.set_folderUrl(location.protocol+"//"+location.host+Audit.Common.Utilities.GetSiteUrl()+"/Lists/"+Audit.Common.Utilities.GetListNameEmailHistory()+"/"+_e);let ut=h.addItem($t);ut.set_item("Title",lt),ut.set_item("Body",oe),ut.set_item("To",qe),ut.set_item("NotificationType","AO Returned Notification"),ut.set_item("ReqNum",_e),ut.set_item("ResID",this.newResponseFolderTitle),ut.update(),re.executeQueryAsync(function(){document.body.style.cursor="default",setTimeout(function(){Ne()},1e3)},function(jt,Qe){alert("Request failed: "+Qe.get_message()+`
`+Qe.get_stackTrace()),setTimeout(function(){ve()},200)})}else if((this.oListItem.get_item("ResStatus")=="4-Approved for QA"||this.oListItem.get_item("ResStatus")=="6-Reposted After Rejection")&&un!=this.oListItem.get_item("ResStatus")){var ae=qt(_e),Ht=ae.responses.find(Qe=>Qe.ID==this.oListItem.get_item("ID")),Nt=!1;await At(ae.item,!1,this.oListItem.get_item("ResStatus"));var ot=0;if(D!=null)for(var Me=D.getEnumerator();Me.moveNext();){var Te=Me.get_current();Te.set_item("FileLeafRef",Os(Te,N,ae.sensitivity)),Te.set_item("DocumentStatus","Sent to QA"),Te.update(),ot++}if(k!=null)for(var Me=k.getEnumerator();Me.moveNext();){var Te=Me.get_current();Te.set_item("FileLeafRef",Os(Te,N,ae.sensitivity)),Te.set_item("DocumentStatus","Sent to QA"),Te.update(),ot++}if(L!=null)for(var Me=L.getEnumerator();Me.moveNext();){var Te=Me.get_current();ot++}if(G!=null){let Qe=new Array;for(var Me=G.getEnumerator();Me.moveNext();){var Te=Me.get_current();Qe.push(Te)}for(var Ot=0;Ot<Qe.length;Ot++)Qe[Ot].deleteObject()}var cs=0;if(Q!=null)for(var Me=Q.getEnumerator();Me.moveNext();){var Te=Me.get_current();Te.set_item("DocumentStatus","Archived"),Te.update(),cs++}let jt=Ht.responseDocs.filter(Qe=>["Sent to QA","Submitted","Open"].includes(Qe.documentStatus));await Hr(ae,jt),re.executeQueryAsync(async function(){ae.coversheets?.length&&await Promise.all(ae.coversheets.map(Qe=>Us(Qe.item,!0))),setTimeout(function(){Ne()},200)},function(Qe,Wt){alert("Request failed: "+Wt.get_message()+`
`+Wt.get_stackTrace()),setTimeout(function(){ve()},200)})}else document.body.style.cursor="default",setTimeout(function(){Ne()},1e3)}function U(re,ye){alert("Request failed: "+ye.get_message()+`
`+ye.get_stackTrace()),setTimeout(function(){ve()},200)}var ie={newResponseFolderTitle:N,oListItem:Y};s.executeQueryAsync(Function.createDelegate(ie,X),Function.createDelegate(ie,U))},function(Y,N){alert("Request failed: "+N.get_message()+`
`+N.get_stackTrace()),setTimeout(function(){ve()},200)})}else fe=!1}function Jr(t,e){let s=SP.UI.Notify.addNotification("Displaying Request ("+t+")",!1);et=null,e!=null&&e!=""&&(et=e),j.tabs.selectTab(j.tabOpts.RequestDetail),$("#ddlReqNum").val()!=t?j.filterRequestInfoTabRequestName(t):et!=null&&$r()}document.readyState==="ready"||document.readyState==="complete"?xr():document.onreadystatechange=()=>{(document.readyState==="complete"||document.readyState==="ready")&&ExecuteOrDelayUntilScriptLoaded(function(){SP.SOD.executeFunc("sp.js","SP.ClientContext",xr)},"sp.js")};})();
//# sourceMappingURL=ia_db.js.map
