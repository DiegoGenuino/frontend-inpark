#!/usr/bin/env python3
"""
Script para adicionar escopo às classes CSS
Adiciona o wrapper da página antes de cada seletor CSS para evitar conflitos
"""

import re
import sys

def add_scope_to_css(css_content, scope_class):
    """
    Adiciona o escopo (wrapper) antes de cada seletor CSS
    
    Args:
        css_content: Conteúdo do arquivo CSS
        scope_class: Classe wrapper (ex: '.dashboard', '.meus-carros-page')
    
    Returns:
        CSS com escopo aplicado
    """
    lines = css_content.split('\n')
    result = []
    in_comment = False
    in_media_query = False
    in_keyframes = False
    
    for line in lines:
        stripped = line.strip()
        
        # Manter imports e comentários
        if stripped.startswith('@import') or stripped.startswith('/*') or stripped.startswith('*'):
            result.append(line)
            continue
            
        # Detectar comentários multi-linha
        if '/*' in stripped:
            in_comment = True
        if '*/' in stripped:
            in_comment = False
            result.append(line)
            continue
            
        if in_comment:
            result.append(line)
            continue
            
        # Detectar @media queries
        if '@media' in stripped:
            in_media_query = True
            result.append(line)
            continue
            
        # Detectar @keyframes
        if '@keyframes' in stripped:
            in_keyframes = True
            result.append(line)
            continue
            
        # Fechar media query ou keyframes
        if in_media_query or in_keyframes:
            result.append(line)
            if stripped == '}' and not any(c in line[:line.index('}')] if '}' in line else '' for c in ['{', ';']):
                in_media_query = False
                in_keyframes = False
            continue
        
        # Processar seletores CSS
        if '{' in stripped and not stripped.startswith('@'):
            # Extrair seletor
            selector_part = stripped[:stripped.index('{')].strip()
            rest_part = stripped[stripped.index('{'):]
            
            # Pular se já tem o escopo
            if selector_part.startswith(scope_class):
                result.append(line)
                continue
            
            # Pular seletores especiais
            if selector_part.startswith(':root') or selector_part.startswith('html') or selector_part.startswith('body') or selector_part.startswith('*'):
                result.append(line)
                continue
                
            # Adicionar escopo
            if ',' in selector_part:
                # Múltiplos seletores
                selectors = [s.strip() for s in selector_part.split(',')]
                scoped_selectors = [f"{scope_class} {s}" if not s.startswith(':') else f"{scope_class}{s}" for s in selectors]
                new_selector = ', '.join(scoped_selectors)
            else:
                # Seletor único
                if selector_part.startswith(':'):
                    new_selector = f"{scope_class}{selector_part}"
                else:
                    new_selector = f"{scope_class} {selector_part}"
            
            # Reconstruir linha com indentação original
            indent = len(line) - len(line.lstrip())
            result.append(' ' * indent + new_selector + ' ' + rest_part)
        else:
            result.append(line)
    
    return '\n'.join(result)


def main():
    if len(sys.argv) < 3:
        print("Uso: python fix-css-scope.py <arquivo.css> <classe-wrapper>")
        print("Exemplo: python fix-css-scope.py Dashboard.css .dashboard")
        sys.exit(1)
    
    file_path = sys.argv[1]
    scope_class = sys.argv[2]
    
    if not scope_class.startswith('.'):
        scope_class = '.' + scope_class
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            css_content = f.read()
        
        scoped_css = add_scope_to_css(css_content, scope_class)
        
        # Salvar backup
        backup_path = file_path + '.backup'
        with open(backup_path, 'w', encoding='utf-8') as f:
            f.write(css_content)
        print(f"✅ Backup criado: {backup_path}")
        
        # Salvar arquivo modificado
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(scoped_css)
        print(f"✅ Escopo '{scope_class}' aplicado em: {file_path}")
        
    except Exception as e:
        print(f"❌ Erro: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
