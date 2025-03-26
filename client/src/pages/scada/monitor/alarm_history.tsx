import schema2component from "@/utils/schema2component";
import {api_crud_search} from "@/pages/constantApi";
import {scada_color_config_create, scada_color_config_delete} from "@/pages/scada/constants/api_constant";

const formBody = [
    {
        type: "hidden",
        name: "id"
    },
    {
        label: "设备状态",
        type: "input",
        name: "deviceStatus",
        required: true
    },
    {
        label: "设备类型",
        type: "select",
        name: "deviceType",
        required: true,
        options: [
            "分拣机",
            "扫描设备",
            "输送线"
        ]
    },
    {
        label: "RGB颜色",
        type: "input-text",
        name: "rgb",
        required: true,
        placeholder: "格式: rgb(255,255,255)",
        validations: {
            matchRegexp: "/^rgb\$\\d{1,3},\\d{1,3},\\d{1,3}\$$/"
        }
    },
    {
        label: "描述",
        type: "textarea",
        name: "description"
    },
    {
        label: "图例显示",
        type: "switch",
        name: "legendVisible",
        trueValue: true,
        falseValue: false
    }
];

const crudColumns = [
    {
        name: "id",
        label: "ID",
        hidden: true
    },
    {
        label: "设备状态",
        type: "input",
        name: "deviceStatus",
        required: true
    },
    {
        name: "deviceType",
        label: "设备类型",
        searchable: {
            type: "select",
            options: [
                "分拣机",
                "扫描设备",
                "输送线"
            ]
        }
    },
    {
        name: "rgb",
        label: "RGB颜色"
    },
    {
        name: "description",
        label: "描述"
    },
    {
        name: "legendVisible",
        label: "图例显示",
        type: "mapping",
        map: {
            true: "显示",
            false: "隐藏"
        }
    }
];
const searchIdentity = "MColorConfig"

const schema = {
    type: "page",
    title: "颜色配置管理",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "ColorConfigTable",
            api: api_crud_search,
            defaultParams: {
                searchIdentity: searchIdentity,
                showColumns: crudColumns,
                searchObject: {
                    orderBy: "update_time desc"
                }
            },
            columns: [...crudColumns,
                {
                    type: "operation",
                    label: "table.operation",
                    width: 230,
                    buttons: [
                        {
                            label: "button.modify",
                            type: "button",
                            actionType: "drawer",
                            drawer: {
                                title: "button.modify",
                                closeOnEsc: true,
                                closeOnOutside: true,
                                body: {
                                    type: "form",
                                    api: scada_color_config_create,
                                    body: formBody
                                }
                            }
                        },
                        {
                            label: "button.delete",
                            type: "button",
                            actionType: "ajax",
                            level: "danger",
                            confirmText: "toast.sureDelete",
                            confirmTitle: "button.delete",
                            api: scada_color_config_delete,
                            reload: "ColorConfigTable"
                        }
                    ],
                    toggled: true
                }],
            headerToolbar: [
                {
                    type: "button",
                    label: "新增",
                    actionType: "drawer",
                    drawer: {
                        title: "新增配置",
                        body: {
                            type: "form",
                            api: scada_color_config_create,
                            body: formBody
                        }
                    }
                },
                "export-excel",
                "reload"
            ]
        }
    ]
};

export default schema2component(schema);
