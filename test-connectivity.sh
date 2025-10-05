#!/bin/bash

echo "🧪 Test de Conectividad - VelyKapet"
echo "===================================="
echo ""

# Test 1: Backend directo
echo "📡 Test 1: Backend directo (http://localhost:5135/api/Productos)"
BACKEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5135/api/Productos)
if [ "$BACKEND_RESPONSE" = "200" ]; then
    echo "✅ Backend responde correctamente: $BACKEND_RESPONSE"
    PRODUCT_COUNT=$(curl -s http://localhost:5135/api/Productos | grep -o '"IdProducto"' | wc -l)
    echo "   📦 Productos encontrados: $PRODUCT_COUNT"
else
    echo "❌ Backend no responde: $BACKEND_RESPONSE"
    exit 1
fi

echo ""

# Test 2: Proxy
echo "🔀 Test 2: Proxy (http://localhost:3333/api/Productos)"
PROXY_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3333/api/Productos)
if [ "$PROXY_RESPONSE" = "200" ]; then
    echo "✅ Proxy funciona correctamente: $PROXY_RESPONSE"
    PRODUCT_COUNT=$(curl -s http://localhost:3333/api/Productos | grep -o '"IdProducto"' | wc -l)
    echo "   📦 Productos encontrados: $PRODUCT_COUNT"
else
    echo "❌ Proxy no responde: $PROXY_RESPONSE"
    exit 1
fi

echo ""

# Test 3: Frontend index
echo "🌐 Test 3: Frontend (http://localhost:3333/)"
INDEX_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3333/)
if [ "$INDEX_RESPONSE" = "200" ]; then
    echo "✅ Frontend carga correctamente: $INDEX_RESPONSE"
else
    echo "❌ Frontend no carga: $INDEX_RESPONSE"
    exit 1
fi

echo ""

# Test 4: Verificar configuración de api.js
echo "⚙️  Test 4: Verificación de api.js"
if grep -q "baseUrl: '/api'" src/api.js; then
    echo "✅ api.js configurado correctamente (baseUrl: '/api')"
else
    echo "⚠️  api.js podría no estar configurado correctamente"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ TODOS LOS TESTS PASARON"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 El sistema está funcionando correctamente"
echo "   Puedes abrir http://localhost:3333 en tu navegador"
echo ""
