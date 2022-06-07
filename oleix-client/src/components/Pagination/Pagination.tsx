import React, { FC, ReactNode } from 'react';
import { Pagination } from 'react-bootstrap';

interface PagePaginationProps {
  total: number;
  per_page: number;
  active: number;
  paginate: (page: number) => void;
}

const PagePagination: FC<PagePaginationProps> = ({ total, per_page, active = 1, paginate }) => {
  const visiblePages = 3;
  const hiddenPages = 3;

  const getPaginationPages = (count: number) => {
    if (active > count) {
      active = count;
    }

    const pagination: ReactNode[] = [];

    if (count <= 0) {
      return pagination;
    }

    switch (true) {
      /**
       * Default pagination to display when amount of all pages is lower than
       * sum of visiblePages + hiddenPages vars - needed amount to display
       * more complex pagination system.
       * */
      case count <= visiblePages + hiddenPages:
        {
          for (let page = 1; page <= count; page++) {
            pagination.push(
              <Pagination.Item key={page} active={active === page} onClick={() => paginate(page)}>
                {page}
              </Pagination.Item>
            );
          }
        }
        return pagination;

      /**
       * Displaying amount of pages set in visiblePages var, ellipsis and last page
       * if active page is lower than count + visiblePages.
       * */
      case count > visiblePages + hiddenPages && active < visiblePages + 1:
        {
          for (let page = 1; page <= visiblePages; page++) {
            pagination.push(
              <Pagination.Item
                key={'first-page-' + page}
                active={active === page}
                onClick={() => paginate(page)}
              >
                {page}
              </Pagination.Item>
            );
          }

          pagination.push(
            <Pagination.Ellipsis
              key={'ellipsis-1-front-' + (visiblePages + visiblePages)}
              onClick={() => paginate(visiblePages + visiblePages)}
            />
          );
          pagination.push(
            <Pagination.Item
              key={'last-page-' + count}
              active={active === count}
              onClick={() => paginate(count)}
            >
              {count}
            </Pagination.Item>
          );
        }
        return pagination;

      /**
       * Default pagination displayed when user went
       * past visiblePages var
       * and is going with only first, current and last page visible
       * until he sets active page to be less than total - visiblePages.
       * */
      case count > visiblePages + hiddenPages &&
        active >= visiblePages + 1 &&
        active <= count - visiblePages:
        {
          const ellipsis = {
            back: active - visiblePages > 1 ? active - visiblePages : active - 1,
            front: active + visiblePages < count ? active + visiblePages : active + 1,
          };

          pagination.push(
            <Pagination.Item key={'first-' + 1} active={active === 1} onClick={() => paginate(1)}>
              1
            </Pagination.Item>
          );

          pagination.push(
            <Pagination.Ellipsis
              key={'ellipsis-back-' + ellipsis.back}
              onClick={() => paginate(ellipsis.back)}
            />
          );

          pagination.push(
            <Pagination.Item
              key={'active-' + active}
              active={active === active}
              onClick={() => paginate(active)}
            >
              {active}
            </Pagination.Item>
          );

          pagination.push(
            <Pagination.Ellipsis
              key={'ellipsis-front-' + ellipsis.front}
              onClick={() => paginate(ellipsis.front)}
            />
          );

          pagination.push(
            <Pagination.Item
              key={'last-' + count}
              active={active === count}
              onClick={() => paginate(count)}
            >
              {count}
            </Pagination.Item>
          );
        }
        return pagination;

      /**
       * Displaying first, ellipsis and last pages set in visiblePages var
       * if active page is higher than count - visiblePages.
       * */
      case count >= 2 * visiblePages + 1 && active > count - visiblePages:
        {
          pagination.push(
            <Pagination.Item
              key={'first-page-' + 1}
              active={active === 1}
              onClick={() => paginate(1)}
            >
              1
            </Pagination.Item>
          );

          pagination.push(
            <Pagination.Ellipsis
              key={'ellipsis-3-back' + (count - visiblePages)}
              onClick={() => paginate(count - visiblePages)}
            />
          );

          for (let page = count - visiblePages + 1; page <= count; page++) {
            pagination.push(
              <Pagination.Item
                key={'last-page-' + page}
                active={active === page}
                onClick={() => paginate(page)}
              >
                {page}
              </Pagination.Item>
            );
          }
        }
        return pagination;

      default:
        return pagination;
    }
  };

  const pages = getPaginationPages(Math.ceil(total / per_page));
  pages.unshift(
    <Pagination.Prev
      key={'prev-' + -1}
      onClick={() => paginate(active - 1)}
      disabled={active === 1}
    />
  );
  pages.push(
    <Pagination.Next
      key={'next-' + (total / per_page + 1)}
      onClick={() => paginate(active + 1)}
      disabled={active === Math.ceil(total / per_page)}
    />
  );

  return <Pagination className="d-flex justify-content-center">{pages}</Pagination>;
};

export default PagePagination;
