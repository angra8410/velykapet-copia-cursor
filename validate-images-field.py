#!/usr/bin/env python3
"""
Script de Validación: Campo Images en API de Productos
Verifica que el campo Images esté correctamente poblado en la respuesta de la API
"""

import requests
import json
import sys

def validate_images_field():
    """Valida que el campo Images esté presente y poblado en la API"""
    
    API_URL = "http://localhost:5135/api/Productos"
    
    print("=" * 70)
    print("🔍 Validación de Campo Images - API de Productos VelyKapet")
    print("=" * 70)
    print()
    
    try:
        # Test 1: Obtener todos los productos
        print("📡 Test 1: Obteniendo todos los productos...")
        response = requests.get(API_URL, timeout=10)
        
        if response.status_code != 200:
            print(f"❌ ERROR: API retornó código {response.status_code}")
            return False
        
        productos = response.json()
        print(f"✅ API respondió correctamente: {len(productos)} productos")
        print()
        
        # Test 2: Verificar campo Images en cada producto
        print("📦 Test 2: Verificando campo Images en cada producto...")
        productos_sin_images = []
        productos_con_images = []
        productos_con_r2 = []
        
        for producto in productos:
            nombre = producto.get('NombreBase', 'Sin nombre')
            images = producto.get('Images', None)
            urlimagen = producto.get('URLImagen', None)
            
            # Verificar que el campo Images existe
            if images is None:
                productos_sin_images.append(nombre)
                print(f"   ❌ {nombre}: Campo Images NO existe")
            elif len(images) == 0:
                productos_sin_images.append(nombre)
                print(f"   ⚠️  {nombre}: Campo Images vacío")
            else:
                productos_con_images.append(nombre)
                primera_imagen = images[0]
                
                # Verificar si es una URL de Cloudflare R2
                if 'velykapet.com' in primera_imagen:
                    productos_con_r2.append(nombre)
                    print(f"   ✅ {nombre}: {len(images)} imagen(es) - Cloudflare R2 ✓")
                else:
                    print(f"   ✅ {nombre}: {len(images)} imagen(es)")
        
        print()
        print("=" * 70)
        print("📊 RESUMEN DE VALIDACIÓN")
        print("=" * 70)
        print(f"Total de productos:              {len(productos)}")
        print(f"✅ Con campo Images poblado:     {len(productos_con_images)}")
        print(f"❌ Sin campo Images o vacío:     {len(productos_sin_images)}")
        print(f"☁️  Con imágenes Cloudflare R2:  {len(productos_con_r2)}")
        print("=" * 70)
        print()
        
        # Test 3: Verificar producto específico con imagen R2
        print("🔍 Test 3: Verificando producto específico (ID 2 - Churu Atún)...")
        response = requests.get(f"{API_URL}/2", timeout=10)
        
        if response.status_code == 200:
            producto = response.json()
            nombre = producto.get('NombreBase')
            urlimagen = producto.get('URLImagen')
            images = producto.get('Images', [])
            
            print(f"   Producto: {nombre}")
            print(f"   URLImagen: {urlimagen}")
            print(f"   Images: {images}")
            
            if images and len(images) > 0 and 'velykapet.com' in images[0]:
                print("   ✅ Campo Images correctamente configurado con URL de Cloudflare R2")
            else:
                print("   ❌ Campo Images no tiene URL de Cloudflare R2")
        else:
            print(f"   ❌ No se pudo obtener producto ID 2: {response.status_code}")
        
        print()
        print("=" * 70)
        
        # Resultado final
        if len(productos_sin_images) == 0:
            print("🎉 ¡VALIDACIÓN EXITOSA! Todos los productos tienen campo Images")
            return True
        else:
            print(f"⚠️  ADVERTENCIA: {len(productos_sin_images)} producto(s) sin Images")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: No se puede conectar a la API")
        print("   Asegúrate de que el backend está corriendo en http://localhost:5135")
        return False
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    success = validate_images_field()
    sys.exit(0 if success else 1)
