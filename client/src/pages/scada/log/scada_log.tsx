import schema2component from "@/utils/schema2component";
import { api_crud_search } from "@/pages/constantApi";


// 表单配置（新增/修改时使用）
const formBody = [
    {
        type: "hidden",
        name: "id"
    },
    {
        label: "日志类型",
        type: "select",
        name: "logType",
        required: true,
        options: [
            "收到货物上报",
            "货物到达上报",
            "目的地回复",
            "目的地请求"
            // 可根据实际日志类型扩展
        ],
        clearable: true
    },
    {
        label: "业务类型",
        type: "select",
        name: "bizType",
        options: [
            "出库",
            "分拣"
        ],
        clearable: true
    },
    {
        label: "数据流向",
        type: "select",
        name: "dataFlow",
        options: [
            "WCS-PLC",
            "PLC→WCS",
            "WCS→PLC",
            "PLC1-WCS",
            "PLC1-PLC",
            "PLC2-WCS",
            "PLC2-PLC"
        ],
        clearable: true
    },
    {
        label: "条码",
        type: "input-text",
        name: "barcode",
        placeholder: "请输入条码"
    },
    {
        label: "实际地址",
        type: "input-text",
        name: "actualAddress"
    },
    {
        label: "BCR编号",
        type: "input-text",
        name: "bcrNo",
        placeholder: "请输入BCR编号"
    },
    {
        label: "分拣结果",
        type: "select",
        name: "sortResult",
        options: [], // 可动态获取或静态定义
        clearable: true
    },
    {
        label: "包裹号",
        type: "input-text",
        name: "packageNo"
    },
    {
        label: "设备编号",
        type: "input-text",
        name: "deviceNo"
    },
    {
        label: "高度",
        type: "input-number",
        name: "height"
    },
    {
        label: "DVC编号",
        type: "input-text",
        name: "dvcNo"
    },
    {
        label: "状态",
        type: "input-text",
        name: "status"
    }
];

// CRUD 表格列配置
const crudColumns = [
    {
        name: "id",
        label: "ID",
        hidden: true
    },
    {
        name: "logType",
        label: "日志类型",
        searchable: {
            type: "select",
            name: "logType",
            clearable: true,
            options: [
                "收到货物上报",
                "货物到达上报",
                "目的地回复",
                "目的地请求"
            ],
            labelField: "label",
            valueField: "value"
        }
    },
    {
        name: "bizType",
        label: "业务类型",
        searchable: {
            type: "select",
            clearable: true,
            options: ["出库", "分拣"]
        }
    },
    {
        name: "dataFlow",
        label: "数据流向"
    },
    {
        name: "barcode",
        label: "条码",
        searchable: {
            type: "input-text",
            placeholder: "请输入条码"
        }
    },
    {
        name: "actualAddress",
        label: "实际地址"
    },
    {
        name: "bcrNo",
        label: "BCR编号",
        searchable: {
            type: "input-text",
            placeholder: "请输入BCR编号"
        }
    },
    {
        name: "sortResult",
        label: "分拣结果",
        searchable: {
            type: "select",
            clearable: true,
            options: [] // 可动态获取
        }
    },
    {
        name: "packageNo",
        label: "包裹号"
    },
    {
        name: "deviceNo",
        label: "设备编号"
    },
    {
        name: "height",
        label: "高度"
    },
    {
        name: "dvcNo",
        label: "DVC编号"
    },
    {
        name: "status",
        label: "状态"
    }
];

const searchIdentity = "MConveyorLog"; // 用于后端接口标识，请根据实际情况修改

const schema = {
    type: "page",
    title: "WCS日志管理",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "WCSLogTable",
            api: api_crud_search,
            defaultParams: {
                searchIdentity: searchIdentity,
                showColumns: crudColumns,
                searchObject: {
                    orderBy: "id desc" // 默认按ID降序
                }
            },
            autoGenerateFilter: {
                columnsNum: 3,
                showBtnToolbar: true
            },
            columns: [
                ...crudColumns
            ],
            headerToolbar: [
                "export-excel",
                "reload"
            ],
            features: ["filter", "bulkDelete", "export"]
        }
    ]
};

export default schema2component(schema);
