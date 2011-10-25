<?php
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
 * @category    Axis
 * @package     Axis_Contacts
 * @copyright   Copyright 2008-2011 Axis
 * @license     GNU Public License V3.0
 */

$router->addRoute('contacts', new Axis_Controller_Router_Route_Front(
    'contacts/:controller/:action/*',
    array(
        'module'     => 'Axis_Contacts',
        'controller' => 'index',
        'action'     => 'index'
    )
));
$router->addRoute('contacts_send', new Axis_Controller_Router_Route_Front(
    'contacts/send',
    array(
        'module'     => 'Axis_Contacts',
        'controller' => 'index',
        'action'     => 'send'
    )
));

$router->addRoute('admin/axis/contacts', new Axis_Controller_Router_Route_Back(
    'contacts/:controller/:action/*',
    array(
        'module'     => 'Axis_Contacts',
        'controller' => 'index',
        'action'     => 'index'
    )
), 'admin/axis/admin');
