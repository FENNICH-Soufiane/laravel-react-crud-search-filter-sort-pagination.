<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    // En résumé, $fillable définit les colonnes du modèle qui peuvent être remplies
    //  de manière massive lors de la création ou de la mise à jour d'une instance du modèle, 
    // et cela contribue à renforcer la sécurité de votre application.
    protected $fillable = ['title', 'body', 'done', 'category_id'];

    // protected $visible = ['id', 'title', 'body', 'category_id', 'created_at', 'updated_at'];

    public function category() {
        // une tâche appartient à une catégorie
        return $this->belongsTo(Category::class);
    }

    public function getCreatedAtAttribute($value) {
        return Carbon::parse($value)->diffForHumans();
    }
}
