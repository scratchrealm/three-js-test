from typing import Tuple
import numpy as np
import figurl as fig


class Surface:
    def __init__(self, *,
        vertices: np.ndarray,
        faces: np.ndarray,
        scalar_data: np.array,
        scalar_range: Tuple[float, float]
    ) -> None:
        self.vertices = vertices
        self.faces = faces
        self.scalar_data = scalar_data
        self.scalar_range = scalar_range
    def url(self, *, label: str):
        d = {
            'type': 'vizor.surface',
            'vertices': self.vertices.astype(np.float32),
            'faces': self.faces.astype(np.int32),
            'scalarData': self.scalar_data.astype(np.float32),
            'scalarRange': [self.scalar_range[0], self.scalar_range[1]]
        }
        F = fig.Figure(
            data=d,
            view_url='https://scratchrealm.github.io/vizor'
        )
        return F.url(label=label)