# -*- mode: python ; coding: utf-8 -*-

import PyInstaller.config

PyInstaller.config.CONF['distpath'] = "./publish"

block_cipher = None

a = Analysis(['.\\src\\main.py'],
             pathex=['.'],
             binaries=None,
             datas=[('.\\dist', 'dist'), ('.\\src\\model', 'model')],
             hiddenimports=['clr'],
             excludes=['.\\src\\utils.py'],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(pyz,
          a.scripts,
          exclude_binaries=True,
          name='webview-object-detection-app',
          debug=False,
          strip=True,
          icon='.\\src\\static\\favicon.ico',
          upx=True,
          console=False)
          
coll = COLLECT(exe,
               a.binaries,
               a.zipfiles,
               a.datas,
               strip=False,
               upx=False,
               name='webview-object-detection-app')