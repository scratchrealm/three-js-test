# 2/25/23
# https://figurl.org/f?v=https://scratchrealm.github.io/vizor/v1&d=sha1://33677f61cab3f82c9e64b9efaf0d7c5b3d248ece&label=example%20vizor%20rbc

import numpy as np
import kachery_cloud as kcl
import vizor as vi
from _parse_vtk import _parse_vtk_unstructured_grid


vtk_uri = 'sha1://9e6a13befd40e36db8bb4bbf28b665a37f1935ef?label=rbc_001.vtk'
vtk_path = kcl.load_file(vtk_uri)

vertices, faces = _parse_vtk_unstructured_grid(vtk_path)

scalar_data = np.sqrt(vertices[:, 0] ** 2 + vertices[:, 1] ** 2 + vertices[:, 2] ** 2)
X = vi.Surface(
    vertices=vertices,
    faces=faces,
    scalar_data=scalar_data,
    scalar_range=[np.min(scalar_data), np.max(scalar_data)]
)
url = X.url(label='example vizor rbc')
print(url)