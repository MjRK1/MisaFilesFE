import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CaretRightOutlined } from '@ant-design/icons';
import cn from 'classnames';


export const PathBreadCrumbs = () => {
  const {"*": currentPath} = useParams();
  const [breadcrumbs, setBreadCrumbs] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    let newBreadcrumbs: string[] = [];
    if (currentPath) {
      newBreadcrumbs = ["Главная", ...currentPath.split('/').filter(Boolean)];
    } else {
      newBreadcrumbs = ["Главная"];
    }
    setBreadCrumbs([...newBreadcrumbs]);
  }, [currentPath]);

  const handleClick = (index) => {
    if (index === breadcrumbs.length - 1) {
      return;
    }
    const finalBreadcrumbs = breadcrumbs.filter(item => item !== 'Главная');
    const link = `/core/modules/MisaFiles/home/${finalBreadcrumbs.slice(0, index).join('/')}`;
    navigate(link);
  };

  return (
    <div className="files-bread-crumbs">
      {breadcrumbs.map((item, i) => (
        <div
          key={`${item}-${i}`}
          className={cn('bread-crumbs__bread-crumb-item', {
            "bread-crumbs__bread-crumb-item--active": i === breadcrumbs?.length - 1
          })}
        >
          <div
            className="bread-crumb-item__title"
            onClick={() => handleClick(i)}
          >
            {item}
          </div>
          {i !== breadcrumbs.length - 1 && (
            <div className="bread-crumb-item__icon">
              <CaretRightOutlined />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
