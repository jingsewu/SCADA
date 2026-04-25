import schema2component from "@/utils/schema2component";
import {api_crud_search} from "@/pages/constantApi";
import {scada_color_config_create, scada_color_config_delete} from "@/pages/scada/constants/api_constant";

const formBody = [
    {
        type: "hidden",
        name: "id"
    },
    {
        label: "scada.monitor.colorConfig.deviceStatus",
        type: "input-number",
        name: "deviceStatus",
        required: true
    },
    {
        label: "scada.monitor.colorConfig.deviceType",
        type: "select",
        name: "deviceType",
        required: true,
        options: [
            {label: "scada.monitor.colorConfig.sorter", value: "分拣机"},
            {label: "scada.monitor.colorConfig.scanner", value: "扫描设备"},
            {label: "scada.monitor.colorConfig.conveyor", value: "输送线"}
        ]
    },
    {
        label: "scada.monitor.colorConfig.rgbColor",
        type: "input-color",
        name: "rgb",
        required: true,
        format: "hex"
    },
    {
        label: "scada.monitor.colorConfig.description",
        type: "textarea",
        name: "description"
    },
    {
        label: "scada.monitor.colorConfig.legendVisible",
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
        label: "scada.monitor.colorConfig.deviceStatus",
        name: "deviceStatus",
        searchable: true
    },
    {
        name: "deviceType",
        label: "scada.monitor.colorConfig.deviceType",
        searchable: {
            type: "select",
            options: [
                {label: "scada.monitor.colorConfig.sorter", value: "分拣机"},
                {label: "scada.monitor.colorConfig.scanner", value: "扫描设备"},
                {label: "scada.monitor.colorConfig.conveyor", value: "输送线"}
            ]
        }
    },
    {
        name: "rgb",
        label: "scada.monitor.colorConfig.rgbColor",
        type: "tpl",
        tpl: '<span style="display:inline-flex;align-items:center;gap:6px;"><span style="display:inline-block;width:16px;height:16px;border-radius:3px;border:1px solid #ddd;background:${rgb};"></span>${rgb}</span>'
    },
    {
        name: "description",
        label: "scada.monitor.colorConfig.description"
    },
    {
        name: "legendVisible",
        label: "scada.monitor.colorConfig.legendVisible",
        type: "mapping",
        map: {
            true: "scada.monitor.colorConfig.show",
            false: "scada.monitor.colorConfig.hide"
        }
    }
];
const searchIdentity = "MColorConfig"

const schema = {
    type: "page",
    title: "scada.monitor.colorConfig.pageTitle",
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
            autoGenerateFilter: {
                columnsNum: 3,
                showBtnToolbar: true
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
                    label: "button.add",
                    actionType: "drawer",
                    drawer: {
                        title: "scada.monitor.colorConfig.addConfig",
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
