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
 * @package     Axis_Catalog
 * @subpackage  Axis_Catalog_Model
 * @copyright   Copyright 2008-2012 Axis
 * @license     GNU Public License V3.0
 */

/**
 *
 * @category    Axis
 * @package     Axis_Catalog
 * @subpackage  Axis_Catalog_Model
 * @author      Axis Core Team <core@axiscommerce.com>
 */
class Axis_Catalog_Model_Product_Option_Select extends Axis_Db_Table_Select
{
    /**
     *
     * @param int $languageId [optional]
     * @return Axis_Catalog_Model_Product_Option_Select Fluent interface
     */
    public function addNameAndDescription($languageId = false)
    {
        $joinCondition = 'cpot.option_id = cpo.id';
        if (false !== $languageId) {
            $joinCondition .= ' AND ' .
                $this->getAdapter()->quoteInto('cpot.language_id = ?', $languageId);
        }
        $this->joinLeft('catalog_product_option_text',
            $joinCondition,
            array('name', 'description')
        );
        return $this;
    }
}