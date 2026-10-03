<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (! Schema::hasColumn('stocktake_items', 'selling_price')) {
            Schema::table('stocktake_items', function (Blueprint $table) {
                $table->double('selling_price')->unsigned()->nullable()->after('unit_buying_price');
            });
        }

        if (! Schema::hasColumn('stocktake_items', 'expiration_date')) {
            Schema::table('stocktake_items', function (Blueprint $table) {
                $table->date('expiration_date')->nullable()->after('selling_price');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $columns = array_values(array_filter(
            ['selling_price', 'expiration_date'],
            fn ($column) => Schema::hasColumn('stocktake_items', $column)
        ));

        if ($columns) {
            Schema::table('stocktake_items', function (Blueprint $table) use ($columns) {
                $table->dropColumn($columns);
            });
        }
    }
};
