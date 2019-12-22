<template>
  <div class="box">
    <el-form ref="form" :model="form" label-width="160px">
      <el-form-item>
        <template #label>
          <el-popover
            placement="left-start"
            title="文件路径"
            width="200"
            trigger="hover"
          >
            <span>存放swagger文件路径<code>/xxxx/app/swagger</code></span>
            <span class="help" slot="reference">文件路径</span>
          </el-popover>
        </template>
        <el-input placeholder="请输入内容" v-model="form.filePath"></el-input>
      </el-form-item>
      <el-form-item>
        <template #label>
          <el-popover
            placement="left-start"
            title="请求地址"
            width="200"
            trigger="hover"
          >
            <span
            >请求地址，唯一key,
              可以通过请求地址回显数据<code>/login</code>或者<code
              >/v1/classroom/update/{id}/{type}</code
              ></span
            >
            <span class="help" slot="reference">请求地址</span>
          </el-popover>
        </template>
        <el-input placeholder="请输入内容" v-model="form.path"></el-input>
      </el-form-item>
      <el-form-item>
        <template #label>
          <el-popover
            placement="left-start"
            title="请求方法"
            width="200"
            trigger="hover"
          >
            <span>
              HTTP 请求方法
              <el-link
                target="_blank"
                href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods"
                type="primary"
              >
                详情
              </el-link>
            </span>
            <span class="help" slot="reference">请求方法</span>
          </el-popover>
        </template>
        <el-select v-model="form.method" placeholder="请选择">
          <el-option
            v-for="formMethod in formMethods"
            :key="formMethod"
            :value="formMethod"
            :label="formMethod"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="接口名称">
        <el-input placeholder="请输入内容" v-model="form.summary"></el-input>
      </el-form-item>
      <el-form-item label="接口描述">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
          v-model="form.description"
        ></el-input>
      </el-form-item>
      <el-form-item class="thisTag">
        <template #label>
          <el-popover
            placement="left-start"
            title="标签分类"
            width="200"
            trigger="hover"
          >
            <span>标签分类可以定义多个，<code>生成的文件名称为标签自然排序第一个</code></span>
            <span class="help" slot="reference">标签分类</span>
          </el-popover>
        </template>
        <span class="moveTag">
          <el-tag
            :key="tag"
            v-for="tag in form.tags"
            closable
            @close="tagDelete(tag)"
          >
            {{ tag }}
          </el-tag>
        </span>
        <el-input
          class="input-new-tag"
          v-if="inputTagVisible"
          v-model="inputTagValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputTagConfirm"
          @blur="handleInputTagConfirm"
        >
        </el-input>
        <el-button
          v-else
          class="button-new-tag"
          size="small"
          @click="showTagInput"
        >+ 添加
        </el-button>
      </el-form-item>
      <el-form-item label="是否授权">
        <el-switch v-model="form.security"></el-switch>
      </el-form-item>
      <el-form-item label="是否弃用">
        <el-switch v-model="form.deprecated"></el-switch>
      </el-form-item>
      <el-form-item>
        <template #label>
          <el-popover
            placement="left-start"
            title="请求内容类型"
            width="200"
            trigger="hover"
          >
            <span
            >如果<code>文件上传</code>请勾选<code>multipart/form-data</code>,
              如果请求参数为<code>body</code>，可以定义请求体数据类型<code
              >application/json,application/xml</code
              ></span
            >
            <span class="help" slot="reference">请求内容类型</span>
          </el-popover>
        </template>
        <el-checkbox-group v-model="form.consumes">
          <el-checkbox
            v-for="formContentType in formContentTypes"
            :key="formContentType"
            :value="formContentType"
            :label="formContentType"
          ></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <template #label>
          <el-popover
            placement="left-start"
            title="请求返回内容类型"
            width="200"
            trigger="hover"
          >
            <span>可以定义多个返回类型</span>
            <span class="help" slot="reference">请求返回内容类型</span>
          </el-popover>
        </template>
        <el-checkbox-group v-model="form.produces">
          <el-checkbox
            v-for="formContentType in formContentTypes"
            :key="formContentType"
            :value="formContentType"
            :label="formContentType"
          ></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <template #label>
          <el-popover
            placement="left-start"
            title="请求参数设置"
            width="200"
            trigger="hover"
          >
            <span
            >如果参数位置为<code>body</code>, 请填写引用，指向<code
            >自定义参数</code
            ></span
            >
            <span class="help" slot="reference">请求参数</span>
          </el-popover>
        </template>
        <el-table
          :data="form.parameter"
          class="formRequest"
          border
          stripe
          row-key="id"
        >
          <el-table-column
            v-for="(requestItem, requestIndex) in requestCol"
            :key="`col_${requestIndex}`"
            :prop="dropRequestCol[requestIndex].prop"
            :label="requestItem.label"
          >
            <template slot-scope="scope">
              <el-link
                v-if="scope.column.property === 'operation'"
                @click="requestDeleteRow(scope.row.id)"
                :underline="false"
                type="primary"
              >删除
              </el-link>
              <el-select
                v-else-if="scope.column.property === 'in'"
                v-model="scope.row.in"
                placeholder="请选择"
                @change="requestChangeIn(scope.row)"
              >
                <el-option
                  v-for="parameterIn in parameterIns"
                  :key="parameterIn"
                  :value="parameterIn"
                  :label="parameterIn"
                ></el-option>
              </el-select>
              <el-select
                v-else-if="scope.column.property === 'type'"
                v-model="scope.row.type"
                placeholder="请选择"
                @change="randomByRow(scope.row)"
              >
                <el-option
                  v-for="parameterType in parameterTypes"
                  :key="parameterType"
                  :value="parameterType"
                  :label="parameterType"
                ></el-option>
              </el-select>
              <el-switch
                v-else-if="scope.column.property === 'required'"
                v-model="scope.row.required"
              >
              </el-switch>
              <el-input
                v-else-if="scope.column.property === 'ref'"
                :disabled="
                  !parameterDisableHef.length ||
                    parameterDisableHef[scope.row.id] !== 1
                "
                v-model="scope.row.ref"
                clearable
              ></el-input>
              <el-input
                v-else-if="scope.column.property === 'default'"
                :disabled="
                  !parameterDisableDefault.length ||
                    parameterDisableDefault[scope.row.id] !== 1
                "
                v-model="scope.row.default"
                clearable
              ></el-input>
              <el-input
                v-else
                v-model="scope.row[scope.column.property]"
                placeholder="请输入内容"
                clearable
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="mt20">
          <el-button type="primary" @click="requestAddRow()">添加</el-button>
          <el-popover placement="top" width="200" v-model="confirmSure">
            <p>是否确定删除？</p>
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini" type="text" @click="cancelConfirm"
              >取消
              </el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="requestDeleteRow(-1)"
              >确定
              </el-button
              >
            </div>
            <el-button
              class="ml20" type="warning" slot="reference"
            >删除
            </el-button
            >
          </el-popover>
        </el-row>
      </el-form-item>
      <el-form-item>
        <template #label>
          <el-popover
            placement="left-start"
            title="使用默认成功返回请求响应模版"
            width="200"
            trigger="hover"
          >
            <span>
              默认指令：<code><pre>{{responseTemplate}}</pre></code>
            </span>
            <span class="help" slot="reference">使用默认请求响应</span>
          </el-popover>
        </template>
        <el-switch v-model="form.openResponseTemplate"></el-switch>
      </el-form-item>
      <el-form-item>
        <template #label>
          <el-popover
            placement="left-start"
            title="请求响应设置"
            width="200"
            trigger="hover"
          >
            <span>
              如果参数位置为<code>body</code>, 请填写引用，指向<code>自定义参数</code>，
            </span>
            <span class="help" slot="reference">请求响应设置</span>
          </el-popover>
        </template>
        <el-table
          :data="form.response"
          border
          stripe
          class="formResponse"
          row-key="id"
        >
          <el-table-column
            v-for="(responseItem, responseIndex) in responseCol"
            :key="`col_${responseIndex}`"
            :prop="dropResponseCol[responseIndex].prop"
            :label="responseItem.label"
          >
            <template slot-scope="scope">
              <el-link
                v-if="scope.column.property === 'operation'"
                @click="responseDeleteRow(scope.row.id)"
                :underline="false"
                type="primary"
              >删除
              </el-link>
              <el-select
                v-else-if="scope.column.property === 'type'"
                v-model="scope.row.type"
                placeholder="请选择"
                @change="definitionChangeIn(scope.row)"
              >
                <el-option
                  v-for="definitionType in definitionTypes"
                  :key="definitionType"
                  :value="definitionType"
                  :label="definitionType"
                ></el-option>
              </el-select>
              <el-input
                v-else-if="scope.column.property === 'ref'"
                :disabled="
                  !parameterDisableHef.length ||
                    parameterDisableHef[scope.row.id] !== 1
                "
                v-model="scope.row.ref"
                clearable
              ></el-input>
              <el-input
                v-else-if="scope.column.property === 'example'"
                :disabled="
                  !parameterDisableDefault.length ||
                    parameterDisableDefault[scope.row.id] !== 1
                "
                v-model="scope.row.example"
                clearable
              ></el-input>
              <el-input
                v-else
                v-model="scope.row[scope.column.property]"
                placeholder="请输入内容"
                clearable
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="mt20">
          <el-button type="primary" @click="responseAddRow()">添加</el-button>
          <el-popover placement="top" width="200" v-model="confirmSure2">
            <p>是否确定删除？</p>
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini" type="text" @click="cancelConfirm"
              >取消
              </el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="responseDeleteRow(-1)"
              >确定
              </el-button
              >
            </div>
            <el-button
              class="ml20" type="warning" slot="reference"
            >删除
            </el-button
            >
          </el-popover>
        </el-row>
      </el-form-item>
      <el-form-item class="dTag" label="自定义参数">
        <span class="moveTag2">
          <el-tag
            :key="index"
            v-for="(tag, index) in form.definition"
            closable
            @click="addDefinition(index)"
            @close="tagDelete2(index)"
          >
            {{tag.name}}
          </el-tag>
        </span>
        <el-dialog
          title="自定义参数设置"
          :visible.sync="dialogFormVisible"
          :show-close="false"
          :before-close="handleClose"
        >
          <el-form label-width="60px">
            <el-form-item label="名称">
              <el-input placeholder="请输入内容" v-model="definitionData.name"></el-input>
            </el-form-item>
            <el-form-item label="模版" class="mt20">
              <el-select
                v-model="definitionData.template"
                placeholder="请选择"
                @change="selectDefinition"
              >
                <el-option
                  v-for="( definitionTemplateName, dname ) in definitionTemplate"
                  :key="dname"
                  :value="dname"
                  :label="dname"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="mt20">
              <el-table
                :data="definitionData.definition"
                border
                stripe
                class="formDefinition"
                row-key="id"
              >
                <el-table-column
                  v-for="(definitionItem, definitionIndex) in definitionCol"
                  :key="`col_${definitionIndex}`"
                  :prop="dropDefinitionCol[definitionIndex].prop"
                  :label="definitionItem.label"
                >
                  <template slot-scope="scope">
                    <el-link
                      v-if="scope.column.property === 'operation'"
                      @click="definitionDeleteRow(scope.row.id)"
                      :underline="false"
                      type="primary"
                    >删除
                    </el-link>
                    <el-select
                      v-else-if="scope.column.property === 'type'"
                      v-model="scope.row.type"
                      @change="definitionChangeIn(scope.row)"
                    >
                      <el-option
                        v-for="definitionType in definitionTypes"
                        :key="definitionType"
                        :value="definitionType"
                        :label="definitionType"
                      ></el-option>
                    </el-select>
                    <el-input
                      v-else-if="scope.column.property === 'ref'"
                      :disabled="
                    !parameterDisableHef.length ||
                      parameterDisableHef[scope.row.id] !== 1"
                      v-model="scope.row.ref"
                      clearable
                    ></el-input>
                    <el-input
                      v-else-if="scope.column.property === 'example'"
                      :disabled="
                    !parameterDisableDefault.length ||
                      parameterDisableDefault[scope.row.id] !== 1
                  "
                      v-model="scope.row.example"
                      clearable
                    ></el-input>
                    <el-input
                      v-else
                      v-model="scope.row[scope.column.property]"
                      placeholder="请输入内容"
                      clearable
                    ></el-input>
                  </template>
                </el-table-column>
              </el-table>
              <el-row class="mt20">
                <el-button type="primary" @click="definitionAddRow()">添加</el-button>
                <el-popover placement="top" width="200" v-model="confirmSure3">
                  <p>是否确定删除？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      size="mini" type="text" @click="cancelConfirm"
                    >取消
                    </el-button
                    >
                    <el-button
                      type="primary"
                      size="mini"
                      @click="definitionDeleteRow(-1)"
                    >确定
                    </el-button
                    >
                  </div>
                  <el-button
                    class="ml20" type="warning" slot="reference"
                  >删除
                  </el-button
                  >
                </el-popover>
              </el-row>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="definitionSave">确 定</el-button>
          </div>
        </el-dialog>
        <el-button
          class="button-new-tag"
          size="small"
          @click="addDefinition()"
        >
          + 添加
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="preview">预览</el-button>
        <el-button type="success" :disabled="!isGenerator" v-if="showSuccess" @click="generator">生成</el-button>
      </el-form-item>
      <el-form-item>
        <el-table
          :data="previewData"
          style="width: 100%"
          v-if="isPreview"
        >
          <el-table-column prop="file" label="文件">
            <template slot-scope="scope">
              <el-link type="primary" @click="fileCompare = true">
                {{scope.row.file}}
              </el-link>
              <el-dialog title="文件对比" :visible.sync="fileCompare">
                <code-diff :old-string="scope.row.oldStr" :new-string="scope.row.newStr" :context="10" />
                <div slot="footer" class="dialog-footer">
                  <el-button @click="fileCompare = false">取 消</el-button>
                  <el-button type="primary" @click="sureCompare">确 定</el-button>
                </div>
              </el-dialog>
            </template>
          </el-table-column>
          <el-table-column
            prop="action"
            label="状态"
            width="180"
          >
            <template slot-scope="scope">
              {{previewAction[scope.row.action]}}
            </template>
          </el-table-column>
        </el-table>
        <el-row v-if="generatorSuccess">
          <div class="default-view-results">
            <pre>
              {{generatorMessage.message}}
              <br/>
              <span v-if="generatorMessage.error" class="error" v-html="generatorMessage.error"></span>
            </pre>
          </div>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Sortable from "sortablejs";
import { randomByName } from "../random";
import { Message } from "element-ui";
import CodeDiff from "vue-code-diff";

export default {
  name: "Index",
  components: { CodeDiff },
  data() {
    return {
      formMethods: [
        "GET",
        "POST",
        "DELETE",
        "PUT",
        "PATCH",
        "OPTIONS",
        "HEAD",
        "CONNECT",
        "TRACE"
      ],
      formContentTypes: [
        "application/json",
        "application/xml",
        "application/x-www-form-urlencoded",
        "multipart/form-data",
        "text/html"
      ],
      inputTagVisible: false,
      dialogFormVisible: false,
      inputTagValue: "",
      tableIndex: -1,
      confirmSure: false,
      confirmSure2: false,
      confirmSure3: false,
      responseTemplate: null,
      definitionTemplate: { default: [] },
      parameterFormat: {
        id: 0,
        name: "",
        description: "",
        in: "",
        type: "",
        ref: "",
        required: true,
        default: ""
      },
      parameterIns: ["formData", "path", "query", "header", "body"],
      parameterTypes: ["string", "number", "integer", "boolean", "file"],
      parameterDisableHef: [],
      parameterDisableDefault: [],
      form: {
        filePath: "",
        path: "",
        method: "",
        tags: [],
        security: true,
        deprecated: false,
        summary: "",
        description: "",
        consumes: ["application/x-www-form-urlencoded"],
        produces: ["application/json", "application/xml"],
        parameter: [],
        openResponseTemplate: true,
        response: [],
        definition: []
      },
      requestCol: [
        {
          label: "字段",
          prop: "name"
        },
        {
          label: "描述",
          prop: "description"
        },
        {
          label: "参数位置",
          prop: "in"
        },
        {
          label: "类型",
          prop: "type"
        },
        {
          label: "引用",
          prop: "ref"
        },
        {
          label: "是否必填",
          prop: "required"
        },
        {
          label: "默认值",
          prop: "default"
        },
        {
          label: "操作",
          prop: "operation"
        }
      ],
      dropRequestCol: [
        {
          label: "字段",
          prop: "name"
        },
        {
          label: "描述",
          prop: "description"
        },
        {
          label: "参数位置",
          prop: "in"
        },
        {
          label: "参数位置",
          prop: "type"
        },
        {
          label: "引用",
          prop: "ref"
        },
        {
          label: "是否必填",
          prop: "required"
        },
        {
          label: "默认值",
          prop: "default"
        },
        {
          label: "操作",
          prop: "operation"
        }
      ],
      responseFormat: {
        id: 0,
        status: "",
        description: "",
        type: "",
        ref: "",
        example: ""
      },
      responseCol: [
        {
          label: "状态码",
          prop: "status"
        },
        {
          label: "描述",
          prop: "description"
        },
        {
          label: "类型",
          prop: "type"
        },
        {
          label: "引用",
          prop: "ref"
        },
        {
          label: "返回值",
          prop: "example"
        },
        {
          label: "操作",
          prop: "operation"
        }
      ],
      dropResponseCol: [
        {
          label: "状态码",
          prop: "status"
        },
        {
          label: "描述",
          prop: "description"
        },
        {
          label: "类型",
          prop: "type"
        },
        {
          label: "引用",
          prop: "ref"
        },
        {
          label: "返回值",
          prop: "example"
        },
        {
          label: "操作",
          prop: "operation"
        }
      ],
      definitionTypes: [
        "string",
        "number",
        "integer",
        "boolean",
        "array",
        "object"
      ],
      definitionFormat: {
        id: 0,
        property: "",
        description: "",
        type: "",
        ref: "",
        example: "",
        template: "add"
      },
      definitionCol: [
        {
          label: "字段",
          prop: "property"
        },
        {
          label: "描述",
          prop: "description"
        },
        {
          label: "类型",
          prop: "type"
        },
        {
          label: "引用",
          prop: "ref"
        },
        {
          label: "默认值",
          prop: "example"
        },
        {
          label: "操作",
          prop: "operation"
        }
      ],
      dropDefinitionCol: [
        {
          label: "字段",
          prop: "property"
        },
        {
          label: "描述",
          prop: "description"
        },
        {
          label: "类型",
          prop: "type"
        },
        {
          label: "引用",
          prop: "ref"
        },
        {
          label: "默认值",
          prop: "example"
        },
        {
          label: "操作",
          prop: "operation"
        }
      ],
      definitionData: {},
      isLoadDefinition: false,
      previewAction: ["无变化", "创建", "覆盖"],
      showSuccess: false,
      isPreview: false,
      fileCompare: false,
      isGenerator: false,
      generatorSuccess: false,
      generatorMessage: "",
      previewData: []
    };
  },
  mounted() {
    this.rowTagDrop();
    this.rowRequestDrop();
    this.columnRequestDrop();
    this.rowResponseDrop();
    this.columnResponseDrop();
    this.rowDefinitionTagDrop();
  },
  created() {
    let _this = this;
    _this.$http.get("swagger/generator").then(res => {
      _this.formMethods = res.httpMethods;
      _this.formContentTypes = res.contentTypes;
      _this.parameterIns = res.parameterIns;
      _this.definitionTypes = res.definitionTypes;
      _this.parameterTypes = res.parameterTypes;
      _this.form.filePath = res.filePath;
      _this.form.openResponseTemplate = res.default.openResponseTemplate;
      _this.responseTemplate = res.default.responseTemplate;
      _this.formatParameter(res.default.parameters, _this);
      _this.formatResponse(res.default.responses, _this);
      _this.definitionTemplate = res.default.definitionTemplate;
    });
  },
  methods: {
    tagDelete(tag) {
      this.form.tags.splice(this.form.tags.indexOf(tag), 1);
    },
    showTagInput() {
      this.inputTagVisible = true;
      this.$nextTick(function() {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputTagConfirm() {
      let inputValue = this.inputTagValue;
      if (inputValue && this.form.tags.indexOf(inputValue) === -1) {
        this.form.tags.push(inputValue);
      }
      this.inputTagVisible = false;
      this.inputTagValue = "";
    },
    rowTagDrop() {
      const tbody = document.querySelector(
        ".thisTag .el-form-item__content .moveTag"
      );
      const _this = this;
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          let currRow = _this.form.tags.splice(oldIndex, 1)[0];
          _this.form.tags.splice(newIndex, 0, currRow);
        }
      });
    },
    rowRequestDrop() {
      const tbody = document.querySelector(
        ".formRequest .el-table__body-wrapper tbody"
      );
      const _this = this;
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          let currRow = _this.form.parameter.splice(oldIndex, 1)[0];
          _this.form.parameter.splice(newIndex, 0, currRow);
        }
      });
    },
    columnRequestDrop() {
      const wrapperTr = document.querySelector(
        ".formRequest .el-table__header-wrapper tr"
      );
      Sortable.create(wrapperTr, {
        animation: 180,
        delay: 0,
        onEnd: evt => {
          const oldItem = this.dropRequestCol[evt.oldIndex];
          this.dropRequestCol.splice(evt.oldIndex, 1);
          this.dropRequestCol.splice(evt.newIndex, 0, oldItem);
        }
      });
    },
    defaultRequestData() {
      let p = [];
      if (!this.tableIndex) {
        this.tableIndex = p.length;
      }
      this.tableIndex++;
      let init = Object.assign({}, this.parameterFormat);
      init.id = this.tableIndex;
      p.push(init);
      this.form.parameter = p;
    },
    requestChangeIn(row, type = 1) {
      let name = row.in;
      let id = row.id;
      if (name !== "body") {
        this.parameterDisableHef[id] = 0;
        this.parameterDisableDefault[id] = 1;
        row.ref = "";
      }
      else {
        this.parameterDisableHef[id] = 1;
        this.parameterDisableDefault[id] = 0;
      }
      if (type) {
        this.randomByRow(row);
      }
    },
    randomByRow(row) {
      // eslint-disable-next-line no-console
      let id = row.id;
      let type = row.type;
      if (this.parameterDisableDefault[id] !== 1 || !type) {
        if (row.hasOwnProperty("example")) {
          row.example = "";
        }
        if (row.hasOwnProperty("default")) {
          row.default = "";
        }
        return;
      }
      let name = row.name;
      let value = randomByName(name, type);
      if (typeof value === "boolean") {
        value = value.toString();
      }
      if (row.hasOwnProperty("example")) {
        row.example = value;
      }
      if (row.hasOwnProperty("default")) {
        row.default = value;
      }
    },
    definitionChangeIn(row, type = 1) {
      let id = row.id;
      let name = row.type;
      if (name === "object" || name === "array") {
        this.parameterDisableHef[id] = 1;
        this.parameterDisableDefault[id] = 0;
      }
      else {
        row.ref = "";
        this.parameterDisableHef[id] = 0;
        this.parameterDisableDefault[id] = 1;
      }
      if (type) {
        this.randomByRow(row);
      }
    },
    requestAddRow() {
      this.tableIndex++;
      let init = Object.assign({}, this.parameterFormat);
      init.id = this.tableIndex;
      this.form.parameter.push(init);
    },
    getIndexById(id, arr) {
      let index = -1;
      let length = arr.length;
      for (let i = 0; i < length; i++) {
        if (id === arr[i]["id"]) {
          index = i;
        }
      }
      if (index < 0) {
        this.$message.error("删除失败");
      }
      return index;
    },
    requestDeleteRow(id) {
      if (id < 0) {
        this.cancelConfirm();
        this.defaultRequestData();
        return;
      }
      let index = this.getIndexById(id, this.form.parameter);
      this.form.parameter.splice(index, 1);
      if (!this.form.parameter.length) {
        this.defaultRequestData();
      }
    },
    cancelConfirm() {
      this.confirmSure = false;
      this.confirmSure2 = false;
      this.confirmSure3 = false;
    },
    rowResponseDrop() {
      const tbody = document.querySelector(
        ".formResponse .el-table__body-wrapper tbody"
      );
      const _this = this;
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          let currRow = _this.form.response.splice(oldIndex, 1)[0];
          _this.form.response.splice(newIndex, 0, currRow);
        }
      });
    },
    columnResponseDrop() {
      const wrapperTr = document.querySelector(
        ".formResponse .el-table__header-wrapper tr"
      );
      Sortable.create(wrapperTr, {
        animation: 180,
        delay: 0,
        onEnd: evt => {
          const oldItem2 = this.dropResponseCol[evt.oldIndex];
          this.dropResponseCol.splice(evt.oldIndex, 1);
          this.dropResponseCol.splice(evt.newIndex, 0, oldItem2);
        }
      });
    },
    responseAddRow() {
      this.tableIndex++;
      let init = Object.assign({}, this.responseFormat);
      init.id = this.tableIndex;
      this.form.response.push(init);
    },
    responseDeleteRow(id) {
      if (id < 0) {
        this.cancelConfirm();
        this.defaultResponseData();
        return;
      }
      let index = this.getIndexById(id, this.form.response);
      this.form.response.splice(index, 1);
      if (!this.form.response.length) {
        this.defaultResponseData();
      }
    },
    defaultResponseData() {
      let p = [];
      if (!this.tableIndex) {
        this.tableIndex = p.length;
      }
      this.tableIndex++;
      let init = Object.assign({}, this.responseFormat);
      init.id = this.tableIndex;
      p.push(init);
      this.form.response = p;
    },
    formatParameter(parameters, vue) {
      if (parameters.length) {
        for (let i = 0; i < parameters.length; ++i) {
          this.tableIndex++;
          parameters[i]["id"] = this.tableIndex;
          vue.requestChangeIn(parameters[i], 0);
        }
        vue.form.parameter = parameters;
      }
      else {
        vue.defaultRequestData();
      }
    },
    formatResponse(responses, vue) {
      if (responses.length) {
        for (let i = 0; i < responses.length; ++i) {
          this.tableIndex++;
          responses[i]["id"] = this.tableIndex;
          vue.definitionChangeIn(responses[i], 0);
        }
        vue.form.response = responses;
      }
      else {
        vue.defaultRequestData();
      }
    },
    handleClose() {
      this.loadDefinition();
    },
    rowDefinitionTagDrop() {
      const tbody = document.querySelector(
        ".dTag .el-form-item__content .moveTag2"
      );
      const _this = this;
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          let currRow = _this.form.definition.splice(oldIndex, 1)[0];
          _this.form.definition.splice(newIndex, 0, currRow);
        }
      });
    },
    rowDefinitionDrop() {
      const tbody = document.querySelector(
        ".formDefinition .el-table__body-wrapper tbody"
      );
      const _this = this;
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          let currRow = _this.definitionData.definition.splice(oldIndex, 1)[0];
          _this.definitionData.definition.splice(newIndex, 0, currRow);
        }
      });
      return tbody;
    },
    columnDefinitionDrop() {
      const wrapperTr = document.querySelector(
        ".formDefinition .el-table__header-wrapper tr"
      );
      Sortable.create(wrapperTr, {
        animation: 180,
        delay: 0,
        onEnd: evt => {
          const oldItem2 = this.dropDefinitionCol[evt.oldIndex];
          this.dropDefinitionCol.splice(evt.oldIndex, 1);
          this.dropDefinitionCol.splice(evt.newIndex, 0, oldItem2);
        }
      });
    },
    defaultDefinitionData(template = "add") {
      let p = [];
      if (!this.tableIndex) {
        this.tableIndex = p.length;
      }
      this.tableIndex++;
      let init = Object.assign({}, this.definitionFormat);
      init.id = this.tableIndex;
      init.template = template;
      p.push(init);
      this.definitionData.definition = p;
    },
    addDefinition(type = -1) {
      let data = {
        name: "",
        template: "default",
        definition: [],
        edit: -1
      };
      if (type >= 0) {
        data = this.form.definition[type];
        data.edit = type;
      }
      this.definitionData = data;
      this.formatDefinition(data.definition, data.template);
      this.dialogFormVisible = true;
    },
    loadDefinition() {
      if (this.isLoadDefinition === false) {
        this.isLoadDefinition = this.rowDefinitionDrop();
        this.columnDefinitionDrop();
      }
    },
    formatDefinition(definitions, template = "add", add = []) {
      if (definitions.length) {
        for (let i = 0; i < definitions.length; ++i) {
          this.tableIndex++;
          if (definitions[i]["id"] === undefined || definitions[i]["edit"] < 0) {
            definitions[i]["id"] = this.tableIndex;
          }
          definitions[i]["template"] = template;
          this.definitionChangeIn(definitions[i], 0);
        }
        this.definitionData.definition = definitions;
      } else {
        this.defaultDefinitionData(template);
      }
      add = add.concat(this.definitionData.definition);
      this.definitionData.definition = add;
    },
    selectDefinition(val) {
      this.loadDefinition();
      let data = [];
      let add = [];
      if (this.definitionTemplate[val]) {
        data = this.definitionTemplate[val];
      }
      for (let i = 0; i < this.definitionData.definition.length; ++i) {
        if (this.definitionData.definition[i]["template"] !== "add") {
          continue;
        }
        add.push(this.definitionData.definition[i]);
      }
      this.formatDefinition(data, val, add);
    },
    definitionAddRow() {
      this.tableIndex++;
      let init = Object.assign({}, this.definitionFormat);
      init.id = this.tableIndex;
      this.definitionData.definition.push(init);
    },
    definitionDeleteRow(id) {
      if (id < 0) {
        this.cancelConfirm();
        this.addDefinition();
        return;
      }
      let index = this.getIndexById(id, this.definitionData.definition);
      this.definitionData.definition.splice(index, 1);
      if (!this.definitionData.definition.length) {
        this.defaultDefinitionData();
      }
    },
    definitionSave() {
      if (!this.definitionData.name) {
        Message.error("自定义名称不能为空");
        return;
      }
      if (this.definitionData.edit < 0) {
        this.form.definition.push(this.definitionData);
      }
      else {
        this.form.definition[this.definitionData.edit] = this.definitionData;
      }
      this.dialogFormVisible = false;
    },
    tagDelete2(tag) {
      this.form.definition.splice(tag, 1);
    },
    checkForm() {
      if (!this.form.filePath) {
        Message.error("文件路径不能为空");
        return false;
      }
      if (!this.form.path) {
        Message.error("请求不能为空");
        return false;
      }
      if (!this.form.method) {
        Message.error("请求方法不能为空");
        return false;
      }
      if (!this.form.tags.length) {
        Message.error("标签分类不能为空");
        return false;
      }
      if (!this.form.consumes.length) {
        Message.error("请求内容类型不能为空");
        return false;
      }
      if (!this.form.produces.length) {
        Message.error("请求返回内容类型不能为空");
        return false;
      }
      if (!this.form.response.length) {
        Message.error("响应设置不能为空");
        return false;
      }
      return true;
    },
    preview() {
      if (!this.checkForm()) {
        return;
      }
      let _this = this;
      _this.$http.post("swagger/generator?t=preview", this.form).then(res => {
        _this.showSuccess = true;
        _this.isPreview = true;
        _this.isGenerator = false;
        _this.generatorSuccess = false;
        _this.previewData = res;
      });
    },
    sureCompare() {
      this.fileCompare = false;
      this.isGenerator = true;
    },
    generator() {
      if (!this.checkForm()) {
        return;
      }
      let _this = this;
      _this.$http.post("swagger/generator?t=generator", this.form).then(res => {
        _this.isPreview = false;
        _this.generatorSuccess = true;
        _this.generatorMessage = res;
      });
    }
  },
  watch: {
    form: {
      handler(newV, oldV) {
        // eslint-disable-next-line no-console
        console.log(newV, oldV);
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.box {
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
}

.help {
  border-bottom: 1px dashed #888;
  cursor: help;
}

code {
  padding: 2px 4px;
  font-size: 90%;
  color: #c7254e;
  background-color: #f9f2f4;
  border-radius: 4px;
}

code a {
  text-decoration: none;
  color: #c7254e;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.mt20 {
  margin-top: 20px;
}

.ml20 {
  margin-left: 20px;
}

.moveTag,
.formRequest,
.formResponse,
.formDefinition {
  cursor: move;
}

.moveTag2 {
  cursor: pointer;
}

.default-view-results pre {
  overflow: auto;
  background-color: #333;
  max-height: 300px;
  color: white;
  padding: 10px;
  border-radius: 0;
  white-space: nowrap;
}

.default-view-results pre .error {
  background: #FFE0E1;
  color: black;
  padding: 1px;
}

pre {
  display: block;
  padding: 9.5px;
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 1.42857143;
  color: #333333;
  word-break: break-all;
  word-wrap: break-word;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
}

code, kbd, pre, samp {
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
}
</style>
