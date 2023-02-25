# 2/25/23
# https://figurl.org/f?v=https://scratchrealm.github.io/vizor/v1&d=sha1://992621f8f1853f1078e82ef2d884f723dcc44952&label=example%20vizor%20surface

import numpy as np
import vizor as vi

n = 6
vertices = np.zeros((n * 4, 3), dtype=np.float32)
faces = np.zeros((n * 3, 3), dtype=np.int32)
scalar_data = np.zeros((n * 4,), dtype=np.float32)
scalar_range = [0, n - 1]
for j in range(n):
    i_v = j * 4
    i_f = j * 3
    x0 = j * 3
    y0 = 0
    z0 = 0
    vertices[i_v + 0, :] = [x0, y0, z0]
    vertices[i_v + 1, :] = [x0 + 2, y0, z0]
    vertices[i_v + 2, :] = [x0, y0 + 4, z0]
    vertices[i_v + 3, :] = [x0 - 2, y0 - 3, z0 + 4]
    faces[i_f + 0, :] = [i_v, i_v + 1, i_v + 2]
    faces[i_f + 1, :] = [i_v, i_v + 1, i_v + 3]
    faces[i_f + 2, :] = [i_v, i_v + 2, i_v + 3]
    scalar_data[i_v + 0] = j
    scalar_data[i_v + 1] = j
    scalar_data[i_v + 2] = j
    scalar_data[i_v + 3] = j

X = vi.Surface(
    vertices=vertices,
    faces=faces,
    scalar_data=scalar_data,
    scalar_range=scalar_range
)
url = X.url(label='example vizor surface')
print(url)