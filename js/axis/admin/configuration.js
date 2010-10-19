/**
 * Axis
 * 
 * This file is part of Axis.
 * 
 * Axis is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * Axis is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Axis.  If not, see <http://www.gnu.org/licenses/>.
 * 
 * @copyright   Copyright 2008-2010 Axis
 * @license     GNU Public License V3.0
 */

var Config, grid;
Ext.onReady(function() {
    Config = {
        siteId: $('#site_id').val(),
        
        showWindow: function() {
            this.window.show();
        },
        
        getSelectedIds: function() {
            var data = [];
            var selectedItems = grid.getSelectionModel().selections.items;
            for (var i = 0; i < selectedItems.length; i++) {
                if (!selectedItems[i].id)
                    continue;
                data[i] = selectedItems[i].id;
            }
            return data;
        },

        addField: function() {
            addFieldWindow.show();
            var node = tree.getSelectionModel().getSelectedNode();
            if (node && typeof node.id === 'string') {
                formNewField.getForm().clear();
                formNewField.getForm().setValues({
                   'path': node.id + '/new_branch'
                })
            }
        },
        
        saveField : function() {
            Ext.getCmp('form_new_field').getForm().submit({
                url: Axis.getUrl('configuration/save-field'),
                success: function() {
                    var path = Ext.getCmp('form_new_field').getForm().findField('path').getValue();
                    Ext.getCmp('add_new_field').hide();
                    tree.getLoader().load(tree.root, function(){
                        tree.expandPath('/' + tree.root.id + '/' + path, '', function(){
                            if (!tree.getNodeById(path)) {
                                path = path.substr(0, path.lastIndexOf('/'));
                            }
                            tree.getNodeById(path).select();
                        });
                        grid.getStore().reload();
                    });
                }
            })
        },

        edit: function(row) {
            if (!row.id) {
                return;
            }
            
            Ext.Ajax.request({
                url: Axis.getUrl('configuration/edit'),
                params: {
                    path: row.id,
                    siteId: Config.siteId
                },
                success: function(response, request) {
                    if (isJSON(response.responseText)) {
                        return;
                    }
                    Config.window.show();
                    Config.window.body.update(response.responseText);
                    $('#confValue').focus();
                }
            });
        },
        
        load: function(node, e) {
            if (typeof(node) == undefined)
                return;
            ds.baseParams = {path: node.id, siteId: Config.siteId};
            ds.load();
        },
        
        save: function() {
            Ext.Ajax.request({
                url: $('#form-edit').attr('action'),
                form: 'form-edit',
                callback: function(response, options) {
                    Config.window.hide();
                    ds.reload();
                }
            });
        },
        
        clear: function() {
            if (Config.siteId == '0' || !confirm('Use values from global namespace?'))
                return;
            var items = Config.getSelectedIds();
            Ext.Ajax.request({
                url: Axis.getUrl('configuration/use-global'),
                params: {
                    pathItems: Ext.encode(items),
                    siteId: Config.siteId
                },
                callback: function() {
                    ds.reload();
                }
            });
        },
        
        copyGlobal: function() {
            if (Config.siteId == '0' || !confirm('Copy values from global namespace?'))
                return;
            var items = Config.getSelectedIds();
            Ext.Ajax.request({
                url: Axis.getUrl('configuration/copy-global'),
                params: {
                    pathItems: Ext.encode(items),
                    siteId: Config.siteId
                },
                callback: function() {
                    ds.reload();
                }
            });
        },
        window: new Ext.Window({
            layout: 'fit',
            width: 345,
            height: 340,
            autoScroll: true,
            bodyStyle:'background:#FFF;',
            closeAction: 'hide',
            title: 'Editing Config Value'.l(),
            buttons: [{
                text: 'Save'.l(),
                handler: function() {
                    Config.save()
                }
            },{
                text: 'Cancel'.l(),
                handler: function(){
                    Config.window.hide();
                }
            }]
        })
    };

    var fieldType = new Ext.form.ComboBox({
       id: 'field_type',
       name: 'config_type',
       hiddenName: 'config_type',
       fieldLabel: 'Type'.l(),
       store: new Ext.data.JsonStore({
              url: Axis.getUrl('configuration/get-field-types'),
           fields: ['id', 'type'],
           id: 'id',
           root: 'data',
           autoLoad: true
       }),
       editable: false,
       value: 'string',
       displayField: 'type',
       valueField: 'id',
       triggerAction: 'all',
       mode: 'local'
    });
    
    var fieldModel = new Ext.form.ComboBox({
       id: 'field_model',
       name: 'model',
       fieldLabel: 'Model'.l(),
       hiddenName: 'model',
       store: new Ext.data.JsonStore({
           url: Axis.getUrl('configuration/get-field-models'),
           fields: ['id', 'name'],
           id: 'id',
           root: 'data',
           autoLoad: true
       }),
       editable: false,
       //value: 'None',
       displayField: 'name',
       valueField: 'name',
       triggerAction: 'all',
       mode: 'local'
    });
    
    var formNewField = new Ext.form.FormPanel({
        border: false,
        labelAlign: 'left',
        id: 'form_new_field',
        defaults: {
            anchor: '100%'
        },
        items: [{
            xtype: 'textfield',
            name: 'path',
            fieldLabel: 'Path'.l(),
            maxLenth: 225,
            allowBlank: false
        },{
            xtype: 'textfield',
            fieldLabel: 'Title'.l(),
            name: 'title',
            maxLenth: 45,
            allowBlank: false
        }, fieldType, fieldModel,{
            xtype: 'textfield',
            fieldLabel: 'Assigned config field path example main/store/country'.l(),
            name: 'model_assigned_with',
            maxLenth: 45,
            allowBlank: true
        },{
            xtype: 'textfield',
            fieldLabel: 'Option example: 1,34,"option3"'.l(),
            name: 'config_options',
            maxLenth: 45,
            allowBlank: true
        },{
            xtype: 'textfield',
            fieldLabel: 'Order'.l(),
            name: 'sort_order',
            maxLenth: 45,
            allowBlank: true
        },{
            xtype: 'textarea',
            fieldLabel: 'Description'.l(),
            name: 'description',
            maxLenth: 45,
            allowBlank: true
        }]
    });
    
    var addFieldWindow =  new Ext.Window({
        title: 'Field'.l(),
        items: formNewField,
        closeAction: 'hide',
        resizable: true,
        maximizable: true,
        id: 'add_new_field',
        constrainHeader: true,
        autoScroll: true,
        bodyStyle: 'background: white; padding: 10px;',
        width: 450,
        height: 400,
        minWidth: 260,
        buttons: [{
            text: 'Save'.l(),
            handler: Config.saveField
        }, {
            text: 'Close'.l(),
            handler: function() { Ext.getCmp('add_new_field').hide()}
        }]
    });
    
    Ext.get('site_id').on('change', function(evt, elem, o) {
        Config.siteId = elem.value;
        ds.baseParams.siteId = Config.siteId;
        ds.reload();
        disableButtons();
    });

    function disableButtons() {
        if (Config.siteId == 0) {
            Ext.getCmp('copy-from-global').disable();
            Ext.getCmp('clear-from-global').disable();
        } else {
            Ext.getCmp('copy-from-global').enable();
            Ext.getCmp('clear-from-global').enable();
        }
    }
    
    var treeToolBar = new Ext.Toolbar();
    treeToolBar.addText('Site: ');
    treeToolBar.addElement('site_id');
    treeToolBar.addFill();
    treeToolBar.addButton({
        cls: 'x-btn-icon',
        icon: Axis.skinUrl + '/images/icons/add.png',
        handler: function() {
            Config.addField();
        }
    });
    
    treeToolBar.addButton({
        cls: 'x-btn-icon',
        icon: Axis.skinUrl + '/images/icons/refresh.png',
        handler: function(){
            rootNode.reload();
        }
    });
    
    /* Configuration tree */
    var tree = new Ext.tree.TreePanel({
        region: 'west',
        collapsible: true,
        collapseMode: 'mini',
        header: false,
        split: true,
        width: 230,
        useArrows:true,
        autoScroll:true,
        animate: false,
        containerScroll: true, 
        loader: new Ext.tree.TreeLoader({
            dataUrl: Axis.getUrl('configuration/get-nodes')
        }),
        tbar: treeToolBar
    });
    
    // set the root node
    var rootNode = new Ext.tree.AsyncTreeNode({
        text: 'Configuration'.l(),
        draggable:false,
        id: '0'
    });
    tree.setRootNode(rootNode);
    
    tree.on('click', Config.load);
    rootNode.expand();
    
    /* Configuration grid */
    var ds = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: Axis.getUrl('configuration/list')
        }),
        reader: new Ext.data.JsonReader({
            id: 'path',
            root: 'data'
        }, [
            {name: 'id'},
            {name: 'config_type'}, 
            {name: 'path'},
            {name: 'title'},
            {name: 'value'},
            {name: 'from'}
        ])
    });
    
    var cm = new Ext.grid.ColumnModel([{
        header: 'Title'.l(),
        dataIndex: 'title',
        width: 200
    }, {
        header: 'Value'.l(),
        dataIndex: 'value',
        width: 250
    }, {
        header: 'Path'.l(),
        dataIndex: 'path',
        width: 250
    }, {
        header: 'Took from'.l(),
        dataIndex: 'from',
        width: 60
    }]);
    
    var grid = new Axis.grid.GridPanel({
        ds: ds,
        cm: cm,
        viewConfig: {
            forceFit: true,
            emptyText: 'No records found'.l()
        },
        tbar: [{
            text: 'Copy from global'.l(),
            icon: Axis.skinUrl + '/images/icons/copy.png',
            cls: 'x-btn-text-icon',
            disabled : true,
            id: 'copy-from-global',
            handler : Config.copyGlobal
        }, {
            text: 'Clear'.l(),
            icon: Axis.skinUrl + '/images/icons/delete.png',
            cls: 'x-btn-text-icon',
            disabled : true,
            id: 'clear-from-global',
            handler : Config.clear
        }],
        plugins: [new Ext.ux.grid.Search({
            mode: 'local',
            width: 180,
            align:'right',
            position:top 
        })]
    });
    
    disableButtons();
    
    grid.on('rowdblclick', function(grid, index) { 
        Config.edit(grid.getStore().getAt(index));
    });
    
    grid.getSelectionModel().on('selectionchange', function(evt, rowIndex, record) {
        toggleButtons();
    });
    
    function toggleButtons() {
        var copyFrom = Ext.getCmp('copy-from-global').disabled;/*,
        clearFrom = Ext.getCmp('clear-from-global').disabled;*/
        
        var selectedItems = grid.getSelectionModel().selections.items;
        if ( selectedItems.length == 0 || Config.siteId == 0) {
            disableButtons();
            return;
        }
        for (var i = 0; i < selectedItems.length; i++) {
            if (!selectedItems[i].id)
                continue;
            if (selectedItems[i].data.from  == 'global') {
                copyFrom = true;
            }
          /* @toto  if (selectedItems[i].data.from  != 'global') {
                clearFrom = true;
            }*/
        }
        if (!copyFrom) {
            Ext.getCmp('copy-from-global').disable();
        } else {
            Ext.getCmp('copy-from-global').enable();
        }
       /* if (!clearFrom) {
             Ext.getCmp('clear-from-global').enable(); //@todo
        } else {
            Ext.getCmp('clear-from-global').disable();
        }*/
        
    };
    
    new Axis.Panel({
        items: [
            tree,
            grid
        ]
    });
    
});